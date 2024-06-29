import { createContext, PropsWithChildren, useEffect, useMemo, useState } from "react";
import useUser from "../hooks/useUser";
import { type AlchemySmartAccountClient, createAlchemySmartAccountClient } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, sepolia } from "@alchemy/aa-core";
import { createLightAccount, LightAccount } from "@alchemy/aa-accounts";
import { custom, sha256  } from "viem";
import { entropyToMnemonic } from "bip39";
import { Alchemy, Network } from "alchemy-sdk";

const sdkClient = new Alchemy({
    url: process.env.EXPO_PUBLIC_ALCHEMY_API_URL!!,
    network: Network.ETH_SEPOLIA
})

const client = createAlchemySmartAccountClient({
    rpcUrl: process.env.EXPO_PUBLIC_ALCHEMY_API_URL!!,
    chain: sepolia,
    gasManagerConfig: {
      policyId: process.env.EXPO_PUBLIC_ALCHEMY_POLICY_ID!!
    }
})

export const AccountContext = createContext<{
    client: AlchemySmartAccountClient,
    sdkClient: Alchemy,
    account: LightAccount | null
}>({
    client,
    sdkClient,
    account: null
})

export function AccountProvider({ children }: PropsWithChildren) {
    const [account, setAccount] = useState<LightAccount | null>(null);
    
    const user = useUser()
    useEffect(() => {
        if (user) {
            const hash = sha256(Buffer.from(user.email, 'utf-8'))
            const entropy = Buffer.from(new Uint8Array(hash.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []).slice(0, 28))

            const mnemonic = entropyToMnemonic(Buffer.from(entropy));

            createLightAccount({
                signer: LocalAccountSigner.mnemonicToAccountSigner(mnemonic),
                transport: custom(client),
                chain: sepolia,
            }).then(setAccount);
        }
    }, [user])

    return (
        <AccountContext.Provider
            value={{
                client,
                sdkClient,
                account
            }}
        >
            {children}
        </AccountContext.Provider>
    )
}