import { useAccountContext } from "./useAccountContext";
import { AssetTransfersCategory, AssetTransfersWithMetadataResult } from "alchemy-sdk";
import { useBlockchainContext } from "../providers/BlockchainProvider";
import { useQuery } from "@tanstack/react-query";

const getTransferCategory = (supports_internal: boolean) => [
  AssetTransfersCategory.ERC1155,
  AssetTransfersCategory.ERC20,
  AssetTransfersCategory.ERC721,
  AssetTransfersCategory.EXTERNAL,
  ...(supports_internal ? [AssetTransfersCategory.INTERNAL] : [])
]

export function useRecentTransactions() {
  const { sdkClient, lightAccount, initiator } = useAccountContext();
  const account = initiator || lightAccount;
  const { blockchain } = useBlockchainContext();
  const query = useQuery({
    queryKey: ['recent-transactions', sdkClient?.config.network],
    queryFn: async () => {
      if (!account) {
        return null;
      }
      const [fromTransfersResponse, toTransfersResponse] = await Promise.all([
        sdkClient!.core.getAssetTransfers({
          fromBlock: "0x0",
          fromAddress: account!.getAddress(),
          category: getTransferCategory(blockchain.supports_internal_transaction_history),
          withMetadata: true,
        }),
      // Fetch to transfers
        sdkClient!.core.getAssetTransfers({
          fromBlock: "0x0",
          toAddress: account!.getAddress(),
          category: getTransferCategory(blockchain.supports_internal_transaction_history),
          withMetadata: true,
        })
      ])

      return {
        fromTransfers: fromTransfersResponse.transfers,
        toTransfers: toTransfersResponse.transfers,
      }
    }
  })

  return query
}
