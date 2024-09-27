import {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import {
  type AlchemySmartAccountClient,
  createAlchemySmartAccountClient,
} from "@alchemy/aa-alchemy";
import {
  LocalAccountSigner,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia
} from "@alchemy/aa-core";
import { createLightAccount, LightAccount } from "@alchemy/aa-accounts";
import { custom } from "viem";
import { getAddress } from "ethers";
import { Alchemy } from "alchemy-sdk";
import { useAuthContext } from "./AuthProvider";
import {
  ALCHEMY_API_KEY,
  OPT_SEPOLIA_ALCHEMY_POLICY_ID,
  SEPOLIA_ALCHEMY_POLICY_ID,
  BASE_SEPOLIA_ALCHEMY_POLICY_ID,
  ARB_SEPOLIA_ALCHEMY_POLICY_ID
} from "../env";
import * as SecureStore from 'expo-secure-store';
import { generateMnemonic } from "bip39";
import uballet from "../api/uballet";
import { User } from "../api/uballet/types";
import { useBlockchainContext } from "./BlockchainProvider";

global.Buffer = global.Buffer || require('buffer').Buffer;

const getAlchemyChain = (name: string) => {
  switch (name) {
    case "arbitrum":
      return arbitrum;
    case "arbitrumSepolia":
      return arbitrumSepolia;
    case "base":
      return base;
    case "baseSepolia":
      return baseSepolia;
    case "mainnet":
      return mainnet;
    case "optimism":
      return optimism;
    case "optimismSepolia":
      return optimismSepolia;
    case "sepolia":
      return sepolia;
    default:
      throw new Error(`Unsupported blockchain name: ${name}`);
  }
};

const getAlchemyPolicyId = (name: string) => {
  switch (name) {
    case "arbitrum":
      return "";
    case "arbitrumSepolia":
      return ARB_SEPOLIA_ALCHEMY_POLICY_ID;
    case "base":
      return "";
    case "baseSepolia":
      return BASE_SEPOLIA_ALCHEMY_POLICY_ID;
    case "mainnet":
      return "";
    case "optimism":
      return "";
    case "optimismSepolia":
      return OPT_SEPOLIA_ALCHEMY_POLICY_ID;
    case "sepolia":
      return SEPOLIA_ALCHEMY_POLICY_ID;
    default:
      throw new Error(`Unsupported blockchain name: ${name}`);
  }
};

export const AccountContext = createContext<{
  client: AlchemySmartAccountClient;
  sdkClient: Alchemy;
  account: LightAccount | null;
  contractDeployed: boolean;
  needsRecovery: boolean;
  initializing: boolean;
  mnemonic: string | null;
  clearMnemonic: () => void;
  recoverWithSeedPhrase: (seedPhrase: string) => Promise<void>;
  initWalletForNetwork: (user: User, selectedNetwork: string) => Promise<boolean>;
}>({
  client: null!,
  sdkClient: null!,
  account: null,
  contractDeployed: false,
  needsRecovery: false,
  initializing: false,
  mnemonic: null,
  clearMnemonic: () => {},
  recoverWithSeedPhrase: async () => {},
  initWalletForNetwork: async () => false,
});

async function getStoredSigner(user: User) {
  const privateKey = await SecureStore.getItemAsync(`signer-${user.id}`);
  if (!privateKey) {
    return null;
  }
  const signer = LocalAccountSigner.privateKeyToAccountSigner(`0x${privateKey}`);
  return signer;
}

export function AccountProvider({ children }: PropsWithChildren) {
  const [account, setAccount] = useState<LightAccount | null>(null);
  const [contractDeployed, setContractDeployed] = useState(false); // New state for contract deployment status
  const [needsRecovery, setNeedsRecovery] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const clearMnemonic = () => setMnemonic(null);
  const { user, setUser } = useAuthContext();
  const { blockchain, selectedNetwork } = useBlockchainContext();

  const sdkClient = new Alchemy({
    url: `${blockchain.api_key_endpoint}${ALCHEMY_API_KEY}`,
    network: blockchain.sdk_name,
  });

  const client = createAlchemySmartAccountClient({
    rpcUrl: `${blockchain.api_key_endpoint}${ALCHEMY_API_KEY}`,
    chain: getAlchemyChain(selectedNetwork),
    gasManagerConfig: {
      policyId: getAlchemyPolicyId(selectedNetwork)!!,
    },
  });

  const checkContractDeployed = async (address: string) => {
    try {
      const code = await sdkClient.core.getCode(address, 'latest');
      setContractDeployed(code !== '0x');
    } catch (error) {
      console.error('Error checking contract deployment:', error);
      setContractDeployed(false);
    }
  };

  const initWallet = async (user: User) => {
    setInitializing(true);
    const mnemonic = generateMnemonic();
    const signer = LocalAccountSigner.mnemonicToAccountSigner(mnemonic);
    const privateKey = Buffer.from(signer.inner.getHdKey().privateKey!).toString('hex');

    await SecureStore.setItemAsync(`signer-${user.id}`, privateKey);
    const lightAccount = await createLightAccount({
      signer: signer,
      transport: custom(client),
      chain: getAlchemyChain(selectedNetwork),
    });

    const updatedUser = await uballet.setUserWalletAddress({ walletAddress: lightAccount.address });

    setMnemonic(mnemonic);
    setAccount(lightAccount);
    setUser(updatedUser);
    setInitializing(false);
    return signer;
  };

  const initWalletForNetwork = async (user: User, selectedNetwork: string) => {
    if (!user.walletAddress) {
      throw new Error(
        `User wallet address is missing. Ensure the user has a valid wallet address before switching to the new network (${selectedNetwork}). This might indicate the user account was not properly initialized on the default network.`
      );
    }

    setInitializing(true);

    const signer = await getStoredSigner(user);

    if (!signer) {
      setInitializing(false);
      throw new Error("Private key not found. User might need recovery.");
    }

    const lightAccount = await createLightAccount({
      signer: signer,
      transport: custom(client),
      chain: getAlchemyChain(selectedNetwork),
    });

    await fetchNonce(lightAccount.address);

    setAccount(lightAccount);
    setInitializing(false);

    return true;
  };

  const fetchNonce = async (accountAddress: string) => {
    try {
      const formattedAddress = getAddress(accountAddress);
      const nonce = await client.getTransactionCount({
        address: formattedAddress as `0x${string}`,
        blockTag: 'latest',
      });
      return nonce;
    } catch (error) {
      console.error("Error fetching nonce:", error);
      throw new Error("Failed to fetch nonce for account.");
    }
  };

  const recoverWithSeedPhrase = async (seedPhrase: string) => {
    const signer = LocalAccountSigner.mnemonicToAccountSigner(seedPhrase);

    const lightAccount = await createLightAccount({
      signer: signer,
      transport: custom(client),
      chain: getAlchemyChain(selectedNetwork),
    });

    if (lightAccount.address !== user?.walletAddress) {
      throw new Error('Wrong seed phrase');
    }
    const privateKey = Buffer.from(signer.inner.getHdKey().privateKey!).toString('hex');

    await SecureStore.setItemAsync(`signer-${user?.id}`, privateKey);
    setNeedsRecovery(false);

    setAccount(lightAccount);
    await fetchNonce(lightAccount.address);
  };

  useEffect(() => {
    if (account) {
      checkContractDeployed(account.address);
    } else {
      setContractDeployed(false);
    }
  }, [account]);

  useEffect(() => {
    console.log("Render");
    if (!user) {
      console.log("A");
      setAccount(null);
      return;
    }
    if (user.verified) {
      console.log("B");
      if (!user.walletAddress) {
        console.log("BA");
        initWallet(user);
        return;
      }
      if (!account) {
        console.log("BB");
        getStoredSigner(user).then((signer) => {
          if (!signer) {
            console.log("BBA");
            setNeedsRecovery(true);
            return;
          }
          createLightAccount({
            signer: signer,
            transport: custom(client),
            chain: getAlchemyChain(selectedNetwork),
          }).then(setAccount);
        });
      }
    }
  }, [user]);

  return (
    <AccountContext.Provider
      value={{
        client,
        sdkClient,
        account,
        contractDeployed,
        needsRecovery,
        initializing,
        mnemonic,
        clearMnemonic,
        recoverWithSeedPhrase,
        initWalletForNetwork,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
