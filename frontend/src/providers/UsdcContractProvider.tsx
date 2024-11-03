import { createContext, PropsWithChildren, useContext } from "react";
import { useBlockchainContext } from "./BlockchainProvider";

const UsdcContractContext = createContext<{ address: string }>({
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
})

export function UsdcContractProvider(props: PropsWithChildren) {
    const { blockchain } = useBlockchainContext()
    return (
        <UsdcContractContext.Provider value={{ address: blockchain.erc20_tokens.find((token) => token.symbol === "USDC")!.address }}>
            {props.children}
        </UsdcContractContext.Provider>
    )
}

export function useUsdcContractAddress() {
    const { address } = useContext(UsdcContractContext)

    return address as `0x${string}`
}