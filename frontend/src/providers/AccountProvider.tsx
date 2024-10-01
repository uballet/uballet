import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Address, LocalAccountSigner } from "@aa-sdk/core"
import { arbitrum, arbitrumSepolia, base, baseSepolia, mainnet, optimism, optimismSepolia, sepolia } from "@account-kit/infra"
import { createLightAccountAlchemyClient, createMultisigAccountAlchemyClient } from "@account-kit/smart-contracts";

import { Alchemy } from "alchemy-sdk";
import { useAuthContext } from "./AuthProvider";
import { ALCHEMY_API_KEY, ARB_SEPOLIA_ALCHEMY_POLICY_ID, BASE_SEPOLIA_ALCHEMY_POLICY_ID, OPT_SEPOLIA_ALCHEMY_POLICY_ID, SEPOLIA_ALCHEMY_POLICY_ID } from "../env";
import { generateMnemonic } from "bip39";
import uballet from "../api/uballet";
import { User } from "../api/uballet/types";
import { useSignerStore } from "../hooks/useSignerStore";
import { DEFAULT_CONFIG, useBlockchainContext } from "./BlockchainProvider";
import { BlockchainConfig } from "../../netconfig/blockchain-config";
import { getL1Allowance } from "viem/zksync";

global.Buffer = global.Buffer || require('buffer').Buffer;

const getAlchemyChain = (name: string) => {
  switch (name) {
    case "arbitrum":
      return arbitrum;
    case "arb-sepolia":
      return arbitrumSepolia;
    case "base":
      return base;
    case "baseSepolia":
      return baseSepolia;
    case "mainnet":
      return mainnet;
    case "optimism":
      return optimism;
    case "opt-sepolia":
      return optimismSepolia;
    case "eth-sepolia":
      return sepolia;
    default:
      throw new Error(`Unsupported blockchain name: ${name}`);
  }
};

export type AlchemyMultisigClient = Awaited<ReturnType<typeof createMultisigAccountAlchemyClient>>;
export type AlchemyLightAccountClient = Awaited<ReturnType<typeof createLightAccountAlchemyClient>>;

type SignerPair = [LocalAccountSigner<any>, LocalAccountSigner<any>];

interface MultisigClientArgs {
  signer: LocalAccountSigner<any>;
  owners?: Address[];
  accountAddress?: Address;
  withoutPaymaster?: boolean;
  chainConfig: BlockchainConfig;
}

function createMultisigClient({
  signer,
  owners,
  accountAddress,
  withoutPaymaster = false,
  chainConfig,
}: MultisigClientArgs): Promise<AlchemyMultisigClient> {
  return createMultisigAccountAlchemyClient({
    signer,
    owners,
    accountAddress,
    threshold: 2n,
    chain: getAlchemyChain(chainConfig.sdk_name),
    rpcUrl: `${chainConfig.api_key_endpoint}${ALCHEMY_API_KEY}`,
    policyId: withoutPaymaster ? undefined : getAlchemyPolicyId(chainConfig.sdk_name)
  })
}

interface LightAccountArgs {
  signer: LocalAccountSigner<any>;
  address?: Address;
  chainConfig: BlockchainConfig;
}

async function createLightAccountClient({ signer, address, chainConfig }: LightAccountArgs): Promise<AlchemyLightAccountClient> {
  const client = await createLightAccountAlchemyClient({
    signer,
    accountAddress: address,
    chain: getAlchemyChain(chainConfig.sdk_name),
    rpcUrl: `${chainConfig.api_key_endpoint}${ALCHEMY_API_KEY}`,
    policyId: getAlchemyPolicyId(chainConfig.sdk_name)!!
  })
  return client
}

interface MultiSigClientPairArgs {
  signers: SignerPair;
  address?: Address
  chainConfig: BlockchainConfig
}

async function createMultisigClientPair({ signers, address, chainConfig }: MultiSigClientPairArgs): Promise<[AlchemyMultisigClient, AlchemyMultisigClient]> {
  const owners = await Promise.all([signers[0].getAddress(), signers[1].getAddress()]);
  const initiator = await createMultisigClient({ signer: signers[0], owners, accountAddress: address, chainConfig })

  const submitter = await createMultisigClient({ signer: signers[1], owners, accountAddress: address, chainConfig })
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
const getAlchemyPolicyId = (name: string) => {
  switch (name) {
    case "arbitrum":
      return "";
    case "arb-sepolia":
      return ARB_SEPOLIA_ALCHEMY_POLICY_ID;
    case "base":
      return "";
    case "baseSepolia":
      return BASE_SEPOLIA_ALCHEMY_POLICY_ID;
    case "mainnet":
      return "";
    case "optimism":
      return "";
    case "opt-sepolia":
      return OPT_SEPOLIA_ALCHEMY_POLICY_ID;
    case "eth-sepolia":
      return SEPOLIA_ALCHEMY_POLICY_ID;
    default:
      throw new Error(`Unsupported blockchain name: ${name}`);
  }
};

export const AccountContext = createContext<{
  accountType: "light" | "multisig" | null;
  setAccountType: (accountType: "light" | "multisig" | null) => void;
  sdkClient: Alchemy | null;
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
  sdkClient: null,
  needsRecovery: false,
  initializing: false,
  recoverWithSeedPhrase: async () => {},
  createMultsigClient: (signer: LocalAccountSigner<any>, address: `0x${string}`) => createMultisigClient({ signer, accountAddress: address, withoutPaymaster: true, chainConfig: DEFAULT_CONFIG }),
});

function getSignersFromSeedphrase(seedphrase: string): SignerPair {
  const signer1 = LocalAccountSigner.mnemonicToAccountSigner(seedphrase, { accountIndex: 0 });
  const signer2 = LocalAccountSigner.mnemonicToAccountSigner(seedphrase, { accountIndex: 1 });
  return [signer1, signer2]
}

async function checkIfSignersAreOwners(signers: SignerPair, user: User, chainConfig: BlockchainConfig): Promise<boolean> {
  const signerAddresses = await Promise.all(signers.map(signer => signer.getAddress()))

  const client = await createMultisigClient({ signer: signers[0], accountAddress: user.walletAddress!, chainConfig });
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
    const { blockchain } = useBlockchainContext();

    const sdkClient = useMemo(() => new Alchemy({
      url: `${blockchain.api_key_endpoint}${ALCHEMY_API_KEY}`,
      network: blockchain.sdk_name,
    }), [blockchain])

    const initWallet = async ({ type: accountType }: { type: "light" | "multisig" }) => {
      setInitializing(true)
      const mnemonic = generateMnemonic();
      const signers = await storeSeedphrase(mnemonic);
      let walletAddress: Address
      if (accountType === "light") {
        const lightClient = await createLightAccountClient({ signer: signers[0], chainConfig: blockchain });
        setLightAccount(lightClient)
        walletAddress = lightClient.getAddress();
      } else {
        const [initiator, submitter] = await createMultisigClientPair({ signers, chainConfig: blockchain });
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
          const isRecoveryFinished = await checkIfSignersAreOwners(recoverySigners, user!, blockchain);

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
        const lightClient = await createLightAccountClient({ signer: signer1, chainConfig: blockchain });
        if (!isSameAddress(lightClient.getAddress(), walletAddress!)) {
          throw new Error('Wrong seed phrase')
        }
        setLightAccount(lightClient);
      } else {
        const signerAddress1 = await signer1.getAddress();
        const signerAddress2 = await signer2.getAddress();
        const [initiator, submitter] = await createMultisigClientPair({ signers:[signer1, signer2], address: user.walletAddress!, chainConfig: blockchain });
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
    }, [user, blockchain])

    const loadAccountFromStorage = async ({ address, type: accountType }: { address: Address, type: "light" | "multisig" }) => {
      const signers = await loadSigners();
      if (!signers) {
        setNeedsRecovery(true)
        return
      }

      if (accountType === "light") {
        const lightClient = await createLightAccountClient({ signer: signers[0], chainConfig: blockchain });
        if (!isSameAddress(lightClient.getAddress(), address)) {
          setNeedsRecovery(true)
          return
        }
        setLightAccount(lightClient);
        setAccountType("light")
        setNeedsRecovery(false);

      } else {
        try {
          const [initiator, submitter] = await createMultisigClientPair({ signers, address, chainConfig: blockchain });

          if (!isSameAddress(initiator.getAddress(), address)) {
            setNeedsRecovery(true)
          } else {
            setInitiator(initiator);
            setSubmitter(submitter);
            setAccountType("multisig")
            setNeedsRecovery(false);
          }
        } catch(e) {
          console.error(e)
          throw e
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
    }, [user, accountType, blockchain]);

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
        createMultsigClient: (signer, address) => createMultisigClient({ signer, accountAddress: address, chainConfig: blockchain, withoutPaymaster: true }),
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
