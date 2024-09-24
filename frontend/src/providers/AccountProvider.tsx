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
import { LocalAccountSigner, optimismSepolia } from "@alchemy/aa-core";
import { createLightAccount, LightAccount } from "@alchemy/aa-accounts";
import { custom } from "viem";
import { Alchemy, Network } from "alchemy-sdk";
import { useAuthContext } from "./AuthProvider";
import { ALCHEMY_API_KEY, ALCHEMY_POLICY_ID } from "../env";
import * as SecureStore from 'expo-secure-store';
import { generateMnemonic } from "bip39";
import uballet from "../api/uballet";
import { User } from "../api/uballet/types";
import { useBlockchainContext } from "./BlockchainProvider";

global.Buffer = global.Buffer || require('buffer').Buffer;

export const AccountContext = createContext<{
  client: AlchemySmartAccountClient;
  sdkClient: Alchemy;
  account: LightAccount | null;
  needsRecovery: boolean;
  initializing: boolean;
  mnemonic: string | null;
  clearMnemonic: () => void;
  recoverWithSeedPhrase: (seedPhrase: string) => Promise<void>;
}>({
  client: null!, // Initialize with null or placeholder
  sdkClient: null!,
  account: null,
  needsRecovery: false,
  initializing: false,
  mnemonic: null,
  clearMnemonic: () => {},
  recoverWithSeedPhrase: async () => {},
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
  const [needsRecovery, setNeedsRecovery] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const clearMnemonic = () => setMnemonic(null);
  const { user, setUser } = useAuthContext();
  const { blockchain } = useBlockchainContext(); // Move this inside the component

  const sdkClient = new Alchemy({
    url: `${blockchain.api_key_endpoint}${ALCHEMY_API_KEY}`,
    network: Network.OPT_SEPOLIA,
  });

  const client = createAlchemySmartAccountClient({
    rpcUrl: `${blockchain.api_key_endpoint}${ALCHEMY_API_KEY}`,
    chain: optimismSepolia,
    gasManagerConfig: {
      policyId: ALCHEMY_POLICY_ID!!,
    },
  });

  const initWallet = async (user: User) => {
    setInitializing(true);
    const mnemonic = generateMnemonic();
    const signer = LocalAccountSigner.mnemonicToAccountSigner(mnemonic);
    const privateKey = Buffer.from(signer.inner.getHdKey().privateKey!).toString('hex');

    await SecureStore.setItemAsync(`signer-${user.id}`, privateKey);
    const lightAccount = await createLightAccount({
      signer: signer,
      transport: custom(client),
      chain: optimismSepolia,
    });

    const updatedUser = await uballet.setUserWalletAddress({ walletAddress: lightAccount.address });

    setMnemonic(mnemonic);
    setAccount(lightAccount);
    setUser(updatedUser);
    setInitializing(false);
    return signer;
  };

  const recoverWithSeedPhrase = async (seedPhrase: string) => {
    const signer = LocalAccountSigner.mnemonicToAccountSigner(seedPhrase);

    const lightAccount = await createLightAccount({
      signer: signer,
      transport: custom(client),
      chain: optimismSepolia,
    });

    if (lightAccount.address !== user?.walletAddress) {
      throw new Error('Wrong seed phrase');
    }
    const privateKey = Buffer.from(signer.inner.getHdKey().privateKey!).toString('hex');

    await SecureStore.setItemAsync(`signer-${user?.id}`, privateKey);
    setNeedsRecovery(false);
    setAccount(lightAccount);
  };

  useEffect(() => {
    if (!user) {
      setAccount(null);
      return;
    }
    if (user.verified) {
      if (!user.walletAddress) {
        initWallet(user);
        return;
      }
      if (!account) {
        getStoredSigner(user).then((signer) => {
          if (!signer) {
            setNeedsRecovery(true);
            return;
          }
          createLightAccount({
            signer: signer,
            transport: custom(client),
            chain: optimismSepolia,
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
        needsRecovery,
        initializing,
        mnemonic,
        clearMnemonic,
        recoverWithSeedPhrase,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
