import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { AssetTransfersCategory, AssetTransfersWithMetadataResult } from "alchemy-sdk";
import { useBlockchainContext } from "../providers/BlockchainProvider";

const getTransferCategory = (supports_internal: boolean) => [
  AssetTransfersCategory.ERC1155,
  AssetTransfersCategory.ERC20,
  AssetTransfersCategory.ERC721,
  AssetTransfersCategory.EXTERNAL,
  ...(supports_internal ? [AssetTransfersCategory.INTERNAL] : [])
]

export function useRecentTransactions() {
  const [fromTransfers, setFromTransfers] = useState<AssetTransfersWithMetadataResult[] | null>(null);
  const [toTransfers, setToTransfers] = useState<AssetTransfersWithMetadataResult[] | null>(null);
  const { sdkClient, lightAccount, initiator } = useAccountContext();
  const account = initiator || lightAccount;
  const [refreshKey, setRefreshKey] = useState(0);
  const { blockchain } = useBlockchainContext();

  const fetchTransfers = async () => {
    try {
      console.log({ sdkNetwork: sdkClient!.config.network })
      // Fetch from transfers
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
      console.log({ fromTransfersResponse, toTransfersResponse })
      setFromTransfers(fromTransfersResponse.transfers);
      setToTransfers(toTransfersResponse.transfers);
    } catch (error) {
      console.error("Error fetching transfers:", error);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [account?.getAddress(), sdkClient?.config.network]);

  const refreshTransactions = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return {
    toTransfers,
    fromTransfers,
    refreshTransactions,
  };
}
