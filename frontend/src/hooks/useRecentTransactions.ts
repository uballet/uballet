import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { AssetTransfersCategory, AssetTransfersResult } from "alchemy-sdk";

export function useRecentTransactions() {
    const [fromTransfers, setFromTransfers] = useState<AssetTransfersResult[] | null>(null)
    const [toTransfers, setToTransfers] = useState<AssetTransfersResult[] | null>(null)
    const { sdkClient, account } = useAccountContext()

    useEffect(() => {
        sdkClient.core.getAssetTransfers({
            fromBlock: "0x0",
            fromAddress: account!.getAddress(),
            category: [
                AssetTransfersCategory.ERC1155,
                AssetTransfersCategory.ERC20,
                AssetTransfersCategory.ERC721,
                AssetTransfersCategory.INTERNAL,
                AssetTransfersCategory.EXTERNAL
            ],
        }).then(transfersResponse => {
            setFromTransfers(transfersResponse.transfers)
        })

        sdkClient.core.getAssetTransfers({
            fromBlock: "0x0",
            toAddress: account!.getAddress(),
            category: [
                AssetTransfersCategory.ERC1155,
                AssetTransfersCategory.ERC20,
                AssetTransfersCategory.ERC721,
                AssetTransfersCategory.INTERNAL,
                AssetTransfersCategory.EXTERNAL
            ],
        }).then(transfersResponse => {
            setToTransfers(transfersResponse.transfers)
        })
    }, [account])

    return {
        toTransfers,
        fromTransfers
    }
}