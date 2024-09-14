import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Address, LocalAccountSigner } from "@aa-sdk/core"
import { sepolia } from "@account-kit/infra"
import { createMultisigAccountAlchemyClient } from "@account-kit/smart-contracts";

import { Alchemy, Network } from "alchemy-sdk";
import { useAuthContext } from "./AuthProvider";
import { ALCHEMY_API_URL, ALCHEMY_POLICY_ID } from "../env";
import * as SecureStore from 'expo-secure-store'
import { generateMnemonic } from "bip39";
import uballet from "../api/uballet";
import { User } from "../api/uballet/types";
import { useSignerStore } from "../hooks/useSignerStore";

global.Buffer = global.Buffer || require('buffer').Buffer;

const sdkClient = new Alchemy({
  url: ALCHEMY_API_URL!!,
  network: Network.ETH_SEPOLIA,
});

export type AlchemyAccountClient = Awaited<ReturnType<typeof createMultisigAccountAlchemyClient>>;

type SignerPair = [LocalAccountSigner<any>, LocalAccountSigner<any>];

function createMultisigClient(signer: LocalAccountSigner<any>, owners?: Address[], accountAddress?: Address): Promise<AlchemyAccountClient> {
  return createMultisigAccountAlchemyClient({
    signer,
    owners,
    accountAddress,
    threshold: 2n,
    chain: sepolia,
    rpcUrl: ALCHEMY_API_URL!!
  })
}

async function createExistingAccountClient(signers: SignerPair, address: `0x${string}`): Promise<[AlchemyAccountClient, AlchemyAccountClient]> {
    const owners = await Promise.all([signers[0].getAddress(), signers[1].getAddress()]);
    const initiator = await createMultisigClient(signers[0], owners, address)
    const submitter = await createMultisigClient(signers[1], owners, address)

    return [initiator, submitter]
}

async function createNewAccountClient(signers: SignerPair): Promise<[AlchemyAccountClient, AlchemyAccountClient]> {
  const owners = await Promise.all([signers[0].getAddress(), signers[1].getAddress()]);
  const initiator = await createMultisigClient(signers[1], owners, undefined)

  const submitter = await createMultisigClient(signers[1], owners, undefined)
  return [initiator, submitter]
}

export const AccountContext = createContext<{
  account: AlchemyAccountClient | null;
  initiator: AlchemyAccountClient | null;
  submitter: AlchemyAccountClient | null;
  sdkClient: Alchemy;
  needsRecovery: boolean;
  initializing: boolean;
  recoverWithSeedPhrase: (seedPhrase: string) => Promise<void>;
  createMultsigClient: (signer: LocalAccountSigner<any>, address: `0x${string}`) => Promise<AlchemyAccountClient>
}>({
  account: null,
  initiator: null,
  submitter: null,
  sdkClient,
  needsRecovery: false,
  initializing: false,
  recoverWithSeedPhrase: async () => {},
  createMultsigClient: (signer: LocalAccountSigner<any>, address: `0x${string}`) => createMultisigClient(signer, undefined, address),
});

function getSignersFromSeedphrase(seedphrase: string): SignerPair {
  const signer1 = LocalAccountSigner.mnemonicToAccountSigner(seedphrase, { accountIndex: 0 });
  const signer2 = LocalAccountSigner.mnemonicToAccountSigner(seedphrase, { accountIndex: 1 });
  return [signer1, signer2]
}

async function checkIfSignersAreOwners(signers: SignerPair, user: User): Promise<boolean> {
  const signerAddresses = await Promise.all(signers.map(signer => signer.getAddress()))
  console.log({ signerAddresses })

  const client = await createMultisigClient(signers[0], undefined, user.walletAddress!);
  const owners = await client.readOwners();
  console.log({ owners })
  return (owners.includes(signerAddresses[0]) && owners.includes(signerAddresses[1]))
}

export function AccountProvider({ children }: PropsWithChildren) {
    const [initiator, setInitiator] = useState<AlchemyAccountClient | null>(null);
    const [submitter, setSubmitter] = useState<AlchemyAccountClient | null>(null);
    const [needsRecovery, setNeedsRecovery] = useState(false);
    const [initializing, setInitializing] = useState(false);
    const { user, setUser } = useAuthContext();
    const { loadSigners, storeSeedphrase, promoteRecoverySeedphrase, loadRecoverySigners } = useSignerStore();
    const initWallet = async (user: User) => {
      setInitializing(true)
      const mnemonic = generateMnemonic();
      const signers = await storeSeedphrase(mnemonic);
      const [initiator, submitter] = await createNewAccountClient(signers)

      const updatedUser = await uballet.setUserWalletAddress({ walletAddress: initiator.getAddress() })
      setInitiator(initiator)
      setSubmitter(submitter)
      setUser(updatedUser)
      setInitializing(false)
    }
    
    useEffect(() => {
      if (needsRecovery) {
        const intervalId = setInterval(async () => {
          const recoverySigners = await loadRecoverySigners();
          if (!recoverySigners) {
            return
          }
          const isRecoveryFinished = await checkIfSignersAreOwners(recoverySigners, user!);

          console.log("isRecoveryFinished", isRecoveryFinished)
          if (isRecoveryFinished) {
            await promoteRecoverySeedphrase();
            loadAccountFromStorage(user!);
          }
        }, 10000)
        return () => clearInterval(intervalId)
      }
    }, [needsRecovery])

    const recoverWithSeedPhrase = useCallback(async (seedPhrase: string) => {
      if (!user) {
        throw new Error('User not ready')
      }
      const [signer1, signer2] = getSignersFromSeedphrase(seedPhrase)
      const signerAddress1 = await signer1.getAddress();
      const signerAddress2 = await signer2.getAddress();
      let [initiator, submitter] = await createExistingAccountClient([signer1, signer2], user.walletAddress! as `0x${string}`);
      const isDeployed = await initiator.account.isAccountDeployed();

      if (!isDeployed) {
        if (initiator.getAddress() !== user?.walletAddress) {
          throw new Error('Wrong seed phrase')
        }
      } else {
        const owners = await initiator.readOwners();

        if (!owners.includes(signerAddress1) || !owners.includes(signerAddress2)) {
          throw new Error('Wrong seed phrase')
        }
      }
      await storeSeedphrase(seedPhrase);
      setNeedsRecovery(false);
      setInitiator(initiator);
      setSubmitter(submitter);
    }, [user])

    const loadAccountFromStorage = async (user: User) => {
      const signers = await loadSigners();
      if (!signers) {
        setNeedsRecovery(true)
        return
      }
      let [initiator, submitter] = await createExistingAccountClient(signers, user.walletAddress! as `0x${string}`);

      if (initiator.getAddress() !== user.walletAddress) {
        setNeedsRecovery(true)
      }

      setNeedsRecovery(false);
      setInitiator(initiator);
      setSubmitter(submitter);
    }

    useEffect(() => {
      if (!user) {
        setInitiator(null)
        setSubmitter(null)
        setNeedsRecovery(false)
        return
      }
      if (user.verified) {
        if (!user.walletAddress) {
          initWallet(user)
          return;
        }
        if (!initiator) {
          loadAccountFromStorage(user)
        }
      }
    }, [user]);

  return (
    <AccountContext.Provider
      value={{
        sdkClient,
        account: initiator,
        initiator,
        submitter,
        needsRecovery,
        initializing,
        recoverWithSeedPhrase,
        createMultsigClient: (signer, address) => createMultisigClient(signer, undefined, address),
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
