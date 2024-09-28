import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Address, LocalAccountSigner } from "@aa-sdk/core"
import { sepolia } from "@account-kit/infra"
import { createLightAccountAlchemyClient, createMultisigAccountAlchemyClient } from "@account-kit/smart-contracts";

import { Alchemy, Network } from "alchemy-sdk";
import { useAuthContext } from "./AuthProvider";
import { ALCHEMY_API_URL, ALCHEMY_POLICY_ID } from "../env";
import { generateMnemonic } from "bip39";
import uballet from "../api/uballet";
import { User } from "../api/uballet/types";
import { useSignerStore } from "../hooks/useSignerStore";

global.Buffer = global.Buffer || require('buffer').Buffer;

const sdkClient = new Alchemy({
  url: ALCHEMY_API_URL!!,
  network: Network.ETH_SEPOLIA,
});

export type AlchemyMultisigClient = Awaited<ReturnType<typeof createMultisigAccountAlchemyClient>>;
export type AlchemyLightAccountClient = Awaited<ReturnType<typeof createLightAccountAlchemyClient>>;

type SignerPair = [LocalAccountSigner<any>, LocalAccountSigner<any>];

function createMultisigClient(signer: LocalAccountSigner<any>, owners?: Address[], accountAddress?: Address, withoutPaymaster?: boolean): Promise<AlchemyMultisigClient> {
  return createMultisigAccountAlchemyClient({
    signer,
    owners,
    accountAddress,
    threshold: 2n,
    chain: sepolia,
    rpcUrl: ALCHEMY_API_URL!!,
    policyId: withoutPaymaster ? undefined : ALCHEMY_POLICY_ID!!
  })
}

async function createLightAccountClient(signer: LocalAccountSigner<any>, address?: Address): Promise<AlchemyLightAccountClient> {
  const client = await createLightAccountAlchemyClient({
    signer,
    accountAddress: address,
    chain: sepolia,
    rpcUrl: ALCHEMY_API_URL!!,
    policyId: ALCHEMY_POLICY_ID!!
  })
  return client
}

async function createMultisigClientPair(signers: SignerPair, address?: Address): Promise<[AlchemyMultisigClient, AlchemyMultisigClient]> {
  const owners = await Promise.all([signers[0].getAddress(), signers[1].getAddress()]);
  const initiator = await createMultisigClient(signers[0], owners, address)

  const submitter = await createMultisigClient(signers[1], owners, address)
  return [initiator, submitter]
}

type AccountClientWithLight = {
  accountType: "light"
  lightAccount: AlchemyLightAccountClient;
  initiator: null;
  submitter: null;
}

type AccountClientWithMultisig = {
  accountType: "multisig"
  lightAccount: null;
  initiator: AlchemyMultisigClient;
  submitter: AlchemyMultisigClient;
}



type AccountClient = AccountClientWithLight | AccountClientWithMultisig | {
  accountType: null
  lightAccount: null
  initiator: null
  submitter: null
}

export const AccountContext = createContext<{
  accountType: "light" | "multisig" | null;
  setAccountType: (accountType: "light" | "multisig" | null) => void;
  sdkClient: Alchemy;
  needsRecovery: boolean;
  initializing: boolean;
  recoverWithSeedPhrase: (seedPhrase: string) => Promise<void>;
  createMultsigClient: (signer: LocalAccountSigner<any>, address: `0x${string}`) => Promise<AlchemyMultisigClient>
} & AccountClient>({
  setAccountType: () => {},
  accountType: null,
  lightAccount: null,
  initiator: null,
  submitter: null,
  sdkClient,
  needsRecovery: false,
  initializing: false,
  recoverWithSeedPhrase: async () => {},
  createMultsigClient: (signer: LocalAccountSigner<any>, address: `0x${string}`) => createMultisigClient(signer, undefined, address, true),
});

function getSignersFromSeedphrase(seedphrase: string): SignerPair {
  const signer1 = LocalAccountSigner.mnemonicToAccountSigner(seedphrase, { accountIndex: 0 });
  const signer2 = LocalAccountSigner.mnemonicToAccountSigner(seedphrase, { accountIndex: 1 });
  return [signer1, signer2]
}

async function checkIfSignersAreOwners(signers: SignerPair, user: User): Promise<boolean> {
  const signerAddresses = await Promise.all(signers.map(signer => signer.getAddress()))

  const client = await createMultisigClient(signers[0], undefined, user.walletAddress!);
  const owners = await client.readOwners();
  return (owners.includes(signerAddresses[0]) && owners.includes(signerAddresses[1]))
}

function isSameAddress(address1: Address, address2: Address) {
  return address1.toLowerCase() === address2.toLowerCase();
}

export function AccountProvider({ children }: PropsWithChildren) {
    const [accountType, setAccountType] = useState<"light" | "multisig" | null>(null);
    const [initiator, setInitiator] = useState<AlchemyMultisigClient | null>(null);
    const [submitter, setSubmitter] = useState<AlchemyMultisigClient | null>(null);
    const [lightAccount, setLightAccount] = useState<AlchemyLightAccountClient | null>(null);
    const [needsRecovery, setNeedsRecovery] = useState(false);
    const [initializing, setInitializing] = useState(false);
    const { user, setUser } = useAuthContext();
    const { loadSigners, storeSeedphrase, promoteRecoverySeedphrase, loadRecoverySigners } = useSignerStore();

    const initWallet = async ({ type: accountType }: { type: "light" | "multisig" }) => {
      setInitializing(true)
      const mnemonic = generateMnemonic();
      const signers = await storeSeedphrase(mnemonic);
      let walletAddress: Address
      if (accountType === "light") {
        const lightClient = await createLightAccountClient(signers[0]);
        setLightAccount(lightClient)
        walletAddress = lightClient.getAddress();
      } else {
        const [initiator, submitter] = await createMultisigClientPair(signers)
        walletAddress = initiator.getAddress();
        setInitiator(initiator)
        setSubmitter(submitter)
      }
      
      const updatedUser = await uballet.setUserWalletAddress({ walletAddress: walletAddress, walletType: accountType })
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

          if (isRecoveryFinished) {
            await promoteRecoverySeedphrase();
            loadAccountFromStorage({ address: user!.walletAddress!, type: user?.walletType ?? 'light' });
          }
        }, 10000)
        return () => clearInterval(intervalId)
      }
    }, [needsRecovery])

    const recoverWithSeedPhrase = useCallback(async (seedPhrase: string) => {
      if (!user) {
        throw new Error('User not ready')
      }
      const { walletAddress, walletType } = user
      const [signer1, signer2] = getSignersFromSeedphrase(seedPhrase)

      if (walletType === "light") {
        const lightClient = await createLightAccountClient(signer1);
        if (!isSameAddress(lightClient.getAddress(), walletAddress!)) {
          throw new Error('Wrong seed phrase')
        }
        setLightAccount(lightClient);
      } else {
        const signerAddress1 = await signer1.getAddress();
        const signerAddress2 = await signer2.getAddress();
        const [initiator, submitter] = await createMultisigClientPair([signer1, signer2], user.walletAddress! as `0x${string}`);
        const isDeployed = await initiator.account.isAccountDeployed();
  
        if (!isDeployed) {
          if (!isSameAddress(initiator.getAddress(), user!.walletAddress!)) {
            throw new Error('Wrong seed phrase')
          }
        } else {
          const owners = await initiator.readOwners();
  
          if (!owners.includes(signerAddress1) || !owners.includes(signerAddress2)) {
            throw new Error('Wrong seed phrase')
          }
        }
        setInitiator(initiator);
        setSubmitter(submitter);
      }
      await storeSeedphrase(seedPhrase);
      setNeedsRecovery(false);
    }, [user])

    const loadAccountFromStorage = async ({ address, type: accountType }: { address: Address, type: "light" | "multisig" }) => {
      const signers = await loadSigners();
      if (!signers) {
        setNeedsRecovery(true)
        return
      }

      if (accountType === "light") {
        const lightClient = await createLightAccountClient(signers[0]);
        if (!isSameAddress(lightClient.getAddress(), address)) {
          setNeedsRecovery(true)
          return
        }
        setLightAccount(lightClient);
        setAccountType("light")
        setNeedsRecovery(false);

      } else {
        const [initiator, submitter] = await createMultisigClientPair(signers, address);

        if (!isSameAddress(initiator.getAddress(), address)) {
          setNeedsRecovery(true)
        } else {
          setInitiator(initiator);
          setSubmitter(submitter);
          setAccountType("multisig")
          setNeedsRecovery(false);
        }
      }

    }

    useEffect(() => {
      if (!user) {
        setInitiator(null)
        setSubmitter(null)
        setLightAccount(null)
        setNeedsRecovery(false)
        setAccountType(null)
        return
      }
      if (user.verified) {
        if (!user.walletAddress && accountType) {
          initWallet({ type: accountType })
          return;
        }
        if (user.walletAddress) {
          loadAccountFromStorage({ address: user.walletAddress!, type: user.walletType ?? 'light' })
        }
      }
    }, [user, accountType]);

  return (
    <AccountContext.Provider
      // @ts-ignore
      value={{
        sdkClient,
        accountType: accountType!,
        setAccountType,
        lightAccount,
        initiator,
        submitter,
        needsRecovery,
        initializing,
        recoverWithSeedPhrase,
        createMultsigClient: (signer, address) => createMultisigClient(signer, undefined, address, true),
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
