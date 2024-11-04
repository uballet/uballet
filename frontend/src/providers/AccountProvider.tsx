import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Address, deepHexlify, LocalAccountSigner, resolveProperties, split } from "@aa-sdk/core"
import { arbitrum, arbitrumSepolia, base, baseSepolia, mainnet, optimism, optimismSepolia, sepolia, createAlchemyPublicRpcClient } from "@account-kit/infra"
import { createMultisigAccountAlchemyClient, createMultisigModularAccountClient, createLightAccountClient as createCustomLightAccountClient, createLightAccountAlchemyClient } from "@account-kit/smart-contracts";

import { Alchemy } from "alchemy-sdk";
import { useAuthContext } from "./AuthProvider";
import { ALCHEMY_API_KEY, IS_E2E_TESTING, ARB_SEPOLIA_ALCHEMY_POLICY_ID, BASE_SEPOLIA_ALCHEMY_POLICY_ID, OPT_SEPOLIA_ALCHEMY_POLICY_ID, SEPOLIA_ALCHEMY_POLICY_ID, PIMLICO_API_KEY } from "../env";
import { generateMnemonic } from "bip39";
import uballet from "../api/uballet";
import { User } from "../api/uballet/types";
import { useSignerStore } from "../hooks/useSignerStore";
import { DEFAULT_CONFIG, useBlockchainContext } from "./BlockchainProvider";
import { BlockchainConfig } from "../../netconfig/blockchain-config";
import { Chain, createClient, http } from "viem";
import { createPimlicoClient } from "permissionless/clients/pimlico"
import { entryPoint06Address } from "viem/account-abstraction"

global.Buffer = global.Buffer || require('buffer').Buffer;

const stackupClient = createClient({
  transport: http("http://localhost:43371"),
})

const getAlchemyChain = (name: string) => {
  switch (name) {
    case "arbitrum":
      return arbitrum;
    case "arb-sepolia":
      return arbitrumSepolia;
    case "base":
      return base;
    case "base-sepolia":
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
  withErc20Gas?: boolean;
}

const getPimlicoUrl = (chainId: string | number) => `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${PIMLICO_API_KEY}`

export const getPimlicoClient = (chain: Chain) => createPimlicoClient({
  chain: chain,
  transport: http(getPimlicoUrl(chain.id)),
  entryPoint: {
    address: entryPoint06Address,
    version: '0.6',
  }
})

export const pimlicoClients = {
  // @ts-ignore
  [sepolia.id]: getPimlicoClient(sepolia),
  // @ts-ignore
  [arbitrumSepolia.id]: getPimlicoClient(arbitrumSepolia),
  // @ts-ignore
  [baseSepolia.id]: getPimlicoClient(baseSepolia),
  // @ts-ignore
  [optimismSepolia.id]: getPimlicoClient(optimismSepolia),
}
 
const erc7677Methods = ["pm_getPaymasterStubData", "pm_getPaymasterData"];
const bundlerMethods = [
  "eth_sendUserOperation",
  "eth_estimateUserOperationGas",
  "eth_getUserOperationReceipt",
  "eth_getUserOperationByHash",
  "eth_supportedEntryPoints",
];
 
const e2eTransport = split({
  overrides: [
    // NOTE: if you're splitting Node and Bundler traffic too, you can add the bundler config to this array
    {
      methods: erc7677Methods,
      transport: http("http://localhost:43371"),
    },
  ],
  fallback: http("http://localhost:8545"),
});

const erc20PaymasterTransport = (alchemyUrl: string, pimlicoUrl: string) => split({
    overrides: [
      {
        methods: erc7677Methods,
        transport: http(pimlicoUrl),
      },
      {
        methods: bundlerMethods,
        transport: http(pimlicoUrl),
      }
    ],
    fallback: http(alchemyUrl),
});

const GAS_FEE_OPTIONS = {
  preVerificationGas: { multiplier: 1.25 },
  paymasterPostOpGasLimit: { multiplier: 1.25 },
  paymasterVerificationGasLimit: { multiplier: 1.25 },
  maxFeePerGas: { multiplier: 1.5 },
  maxPriorityFeePerGas: { multiplier: 1.25 },
}

const RETRY_OPTIONS = {
  txMaxRetries: 7,
  txRetryIntervalMs: 2_000,
  txRetryMultiplier: 1.5
}

async function createMultisigClient({
  signer,
  owners,
  accountAddress,
  withoutPaymaster = false,
  withErc20Gas = false,
  chainConfig,
}: MultisigClientArgs): Promise<AlchemyMultisigClient> {
  const chain = getAlchemyChain(chainConfig.sdk_name);
  const pimlicoUrl = getPimlicoUrl(chain.id);
  const pimlicoClient = pimlicoClients[chain.id];

  if (IS_E2E_TESTING) {
    // @ts-ignore
    return createMultisigModularAccountClient({
      signer,
      owners,
      accountAddress,
      threshold: 2n,
      chain: {
        ...getAlchemyChain(chainConfig.sdk_name),
        rpcUrls: {
          default: { http: [`http://localhost:8545`] },
        }
      },
      gasEstimator: async (userOp) => ({
        ...userOp,
        preVerificationGas:"0xa27C0",
        callGasLimit:"0xa27c",
        verificationGasLimit:"0x5927c0"
      }),
      paymasterAndData: async (userop, opts) => {
        const pmResponse: any = await stackupClient.request({
          // @ts-ignore
          method: "pm_sponsorUserOperation",
          params: [
            deepHexlify(await resolveProperties(userop)),
            opts.account.getEntryPoint().address,
            {
              // @ts-ignore
              type: "payg", // Replace with ERC20 context based on stackups documentation
            },
          ],
        })
      
        return {
          ...userop,
          ...pmResponse,
          paymasterAndData: '0x',
        };
      },
      // @ts-ignore
      transport: e2eTransport,
      factoryAddress: '0x42FfC8c171D7F62b231633E9d06f11a83aA6E09e',
      // policyId: withoutPaymaster ? undefined : getAlchemyPolicyId(chainConfig.sdk_name)
    })
  }

  if (withErc20Gas) {
    // @ts-ignore
    return createMultisigModularAccountClient({
      signer,
      owners,
      accountAddress,
      threshold: 2n,
      chain: getAlchemyChain(chainConfig.sdk_name),
      // @ts-ignore
      transport: erc20PaymasterTransport(`${chainConfig.api_key_endpoint}${ALCHEMY_API_KEY}`, pimlicoUrl),
      feeEstimator: async (uo) => {
        const gasFees = (await pimlicoClient.getUserOperationGasPrice()).fast
        return {
          ...uo,
          maxFeePerGas: gasFees.maxFeePerGas,
          maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas
        }
      },
      dummyPaymasterAndData: async (userop) => ({
        ...userop,
        paymasterAndData: "0x",
      }),  
      paymasterAndData: async (userop, opts) => {
        try {
          const pmResponse = await pimlicoClient.getPaymasterData({
            ...deepHexlify(await resolveProperties(userop)),
            entryPoint: opts.account.getEntryPoint().address,
            type: "payg",
            chainId: chain.id,
            entryPointAddress: opts.account.getEntryPoint().address,
            context: {
              token: chainConfig.erc20_tokens.find((token) => token.symbol === "USDC")!.address
            }
          })

          return {
            ...userop,
            ...pmResponse,
          }
        } catch (e) {
          console.error({ e })
        }

        return {
          ...userop,
          paymasterAndData: '0x',
        }
      },
      opts: {
        feeOptions: GAS_FEE_OPTIONS,
        ...RETRY_OPTIONS
      }
    })
  }

  // @ts-ignore
  return createMultisigAccountAlchemyClient({
    signer,
    owners,
    accountAddress,
    threshold: 2n,
    chain: getAlchemyChain(chainConfig.sdk_name),
    rpcUrl: `${chainConfig.api_key_endpoint}${ALCHEMY_API_KEY}`,
    policyId: withoutPaymaster ? undefined : getAlchemyPolicyId(chainConfig.sdk_name),
    
    opts: {
      feeOptions: GAS_FEE_OPTIONS,
      ...RETRY_OPTIONS
    }
  })
}

interface LightAccountArgs {
  signer: LocalAccountSigner<any>;
  address?: Address;
  chainConfig: BlockchainConfig;
  withErc20Gas?: boolean;
}


async function createLightAccountClient({ signer, address, chainConfig, withErc20Gas }: LightAccountArgs): Promise<AlchemyLightAccountClient> {
    const chain = getAlchemyChain(chainConfig.sdk_name);
    const pimlicoUrl = getPimlicoUrl(chain.id)
    const pimlicoClient = pimlicoClients[chain.id]
    
    if (IS_E2E_TESTING) {
      // @ts-ignore
      return createCustomLightAccountClient({
        signer,
        accountAddress: address,
        // @ts-ignore
        transport: e2eTransport,
        gasEstimator: async (userOp) => ({
          ...userOp,
          preVerificationGas:"0xa27C0",
          callGasLimit:"0xa27c",
          verificationGasLimit:"0x5927c0"
        }),
        paymasterAndData: async (userop, opts) => {
          const pmResponse: any = await stackupClient.request({
            // @ts-ignore
            method: "pm_sponsorUserOperation",
            params: [
              deepHexlify(await resolveProperties(userop)),
              opts.account.getEntryPoint().address,
              {
                // @ts-ignore
                type: "payg", // Replace with ERC20 context based on stackups documentation
              },
            ],
          })
        
          return {
            ...userop,
            ...pmResponse,
            paymasterAndData: '0x',
          };
        },
        chain: {
          ...getAlchemyChain(chainConfig.sdk_name),
          rpcUrls: {
            default: { http: [`http://localhost:8545`] },
          }
        },
        factoryAddress: '0x42FfC8c171D7F62b231633E9d06f11a83aA6E09e',
      })
    }

    if (withErc20Gas) {
      const client = await createCustomLightAccountClient({
        signer,
        version: 'v1.1.0',
        accountAddress: address,
        chain: getAlchemyChain(chainConfig.sdk_name),
        // @ts-ignore
        transport: erc20PaymasterTransport(`${chainConfig.api_key_endpoint}${ALCHEMY_API_KEY}`, pimlicoUrl),
        feeEstimator: async (uo) => {
          const gasPrice = (await pimlicoClient.getUserOperationGasPrice()).fast
          return {
            ...uo,
            ...gasPrice
          }
        },
        dummyPaymasterAndData: async (userop) => ({
          ...userop,
          paymasterAndData: "0x",
        }),  
        paymasterAndData: async (userop, opts) => {
          const pmResponse = await pimlicoClient.getPaymasterData({
            ...deepHexlify(await resolveProperties(userop)),
            entryPoint: opts.account.getEntryPoint().address,
            type: "payg",
            chainId: chain.id,
            entryPointAddress: opts.account.getEntryPoint().address,
            context: {
              token: chainConfig.erc20_tokens.find((token) => token.symbol === "USDC")!.address
            }
          })
          return {
            ...userop,
            ...pmResponse,
          }
        },
        opts: {
          feeOptions: GAS_FEE_OPTIONS,
          ...RETRY_OPTIONS
        }
      })

      // @ts-ignore
      return client
    }

    const client = await createLightAccountAlchemyClient({
      signer,
      version: 'v1.1.0',
      accountAddress: address,
      chain: getAlchemyChain(chainConfig.sdk_name),
      rpcUrl: `${chainConfig.api_key_endpoint}${ALCHEMY_API_KEY}`,
      policyId: getAlchemyPolicyId(chainConfig.sdk_name)!!,
      opts: {
        feeOptions: GAS_FEE_OPTIONS,
        ...RETRY_OPTIONS
      }
    })

    return client
}

function getAlchemySdkClient(blockchain: BlockchainConfig) {
  if (IS_E2E_TESTING) {
    return new Alchemy({
      url: 'http://localhost:8545',
      network: blockchain.sdk_name,
    })
  }
  return new Alchemy({
    url: `${blockchain.api_key_endpoint}${ALCHEMY_API_KEY}`,
    network: blockchain.sdk_name,
  })
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
  erc20LightAccount: AlchemyLightAccountClient;
  initiator: null;
  submitter: null;
}

type AccountClientWithMultisig = {
  accountType: "multisig"
  lightAccount: null;
  initiator: AlchemyMultisigClient;
  erc20Initiator: AlchemyMultisigClient;
  submitter: AlchemyMultisigClient;
  erc20Submitter: AlchemyMultisigClient;
}

type AccountClient = AccountClientWithLight | AccountClientWithMultisig | {
  accountType: null
  lightAccount: null
  erc20LightAccount: null
  initiator: null
  erc20Initiator: null
  submitter: null
  erc20Submitter: null
}
const getAlchemyPolicyId = (name: string) => {
  switch (name) {
    case "arbitrum":
      return "";
    case "arb-sepolia":
      return ARB_SEPOLIA_ALCHEMY_POLICY_ID;
    case "base":
      return "";
    case "base-sepolia":
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
  erc20LightAccount: null,
  initiator: null,
  erc20Initiator: null,
  submitter: null,
  erc20Submitter: null,
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
    const [erc20Initiator, setErc20Initiator] = useState<AlchemyMultisigClient | null>(null);
    const [erc20Submitter, setErc20Submitter] = useState<AlchemyMultisigClient | null>(null);
    const [lightAccount, setLightAccount] = useState<AlchemyLightAccountClient | null>(null);
    const [erc20LightAccount, setErc20LightAccount] = useState<AlchemyLightAccountClient | null>(null);
    const [needsRecovery, setNeedsRecovery] = useState(false);
    const [initializing, setInitializing] = useState(false);
    const { user, setUser } = useAuthContext();
    const { loadSigners, storeSeedphrase, promoteRecoverySeedphrase, loadRecoverySigners } = useSignerStore();
    const { blockchain } = useBlockchainContext();

    const sdkClient = useMemo(() => getAlchemySdkClient(blockchain), [blockchain]);
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
      if (!lightAccount) {
        setErc20LightAccount(null)
      }
      if (lightAccount) {
        createLightAccountClient({ signer: lightAccount.account.getSigner(), chainConfig: blockchain, withErc20Gas: true }).then(setErc20LightAccount)
      }
    }, [lightAccount])

    useEffect(() => {
      if (!initiator) {
        setErc20Initiator(null)
      }
      if (initiator) {
        createMultisigClient({ signer: initiator.account.getSigner(), accountAddress: user!.walletAddress!, chainConfig: blockchain, withErc20Gas: true }).then(setErc20Initiator)
      }
    }, [initiator])

    useEffect(() => {
      if (!submitter) {
        setErc20Submitter(null)
      }
      if (submitter) {
        createMultisigClient({ signer: submitter.account.getSigner(), accountAddress: user!.walletAddress!, chainConfig: blockchain, withErc20Gas: true }).then(setErc20Submitter)
      }
    }, [submitter])

    useEffect(() => {
      if (needsRecovery) {
        async function checkRecovery() {
          const recoverySigners = await loadRecoverySigners();
          if (!recoverySigners) {
            return
          }
          const isRecoveryFinished = await checkIfSignersAreOwners(recoverySigners, user!, blockchain);

          if (isRecoveryFinished) {
            await promoteRecoverySeedphrase();
            loadAccountFromStorage({ address: user!.walletAddress!, type: user?.walletType ?? 'light' });
          }
        }
        checkRecovery();
        const intervalId = setInterval(async () => {
          await checkRecovery();
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

      const isDeployed = await sdkClient.core.isContractAddress(user.walletAddress!)
      if (walletType === "light" || !walletType) {
        const lightClient = await createLightAccountClient({ signer: signer1, chainConfig: blockchain });
        if (!isSameAddress(lightClient.getAddress(), walletAddress!)) {
          throw new Error('Wrong seed phrase')
        }
        setLightAccount(lightClient);
      } else {
        const signerAddress1 = await signer1.getAddress();
        const signerAddress2 = await signer2.getAddress();
        const [initiator, submitter] = await createMultisigClientPair({ signers:[signer1, signer2], address: isDeployed ? user.walletAddress! : undefined, chainConfig: blockchain });
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
    }, [user, blockchain, accountType])

    const loadAccountFromStorage = async ({ address, type: accountType }: { address: Address, type: "light" | "multisig" }) => {
      const signers = await loadSigners();
      if (!signers) {
        const recoverySigners = await loadRecoverySigners();
        if (!recoverySigners) {
          setNeedsRecovery(true)
          return
        }
        const isRecoveryFinished = await checkIfSignersAreOwners(recoverySigners, user!, blockchain);
        if (isRecoveryFinished) {
          await promoteRecoverySeedphrase();
          loadAccountFromStorage({ address: user!.walletAddress!, type: user?.walletType ?? 'light' });
        }
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
        setAccountType(null)
      }
      if (user?.walletAddress) {
        setAccountType(user?.walletType ?? 'light')
      }
    })

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
        if (!accountType) {
          return;
        }
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
        // @ts-ignore
        erc20LightAccount,
        erc20Initiator,
        erc20Submitter,
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
