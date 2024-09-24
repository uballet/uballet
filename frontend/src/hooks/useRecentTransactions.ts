import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { useSafeLightAccount } from "./useLightAccount";
import { AssetTransfersCategory, AssetTransfersWithMetadataResult } from "alchemy-sdk";

export function useRecentTransactions() {
  const [fromTransfers, setFromTransfers] = useState<AssetTransfersWithMetadataResult[] | null>(null);
  const [toTransfers, setToTransfers] = useState<AssetTransfersWithMetadataResult[] | null>(null);
  const account = useSafeLightAccount();
  const { sdkClient } = useAccountContext();
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTransfers = async () => {
    try {
      // Fetch from transfers
      const fromTransfersResponse = await sdkClient.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: account.address,
        category: [
          AssetTransfersCategory.ERC1155,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.EXTERNAL,
        ],
        withMetadata: true,
      });
      setFromTransfers(fromTransfersResponse.transfers);

      // Fetch to transfers
      const toTransfersResponse = await sdkClient.core.getAssetTransfers({
        fromBlock: "0x0",
        toAddress: account.address,
        category: [
          AssetTransfersCategory.ERC1155,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.EXTERNAL,
        ],
        withMetadata: true,
      });
      setToTransfers(toTransfersResponse.transfers);
    } catch (error) {
      console.error("Error fetching transfers:", error);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [account.address, refreshKey]);

  const refreshTransactions = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return {
    toTransfers,
    fromTransfers,
    refreshTransactions,
  };
}
