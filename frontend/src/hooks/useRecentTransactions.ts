import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { useSafeLightAccount } from "./useLightAccount";
import { AssetTransfersCategory, AssetTransfersWithMetadataResult } from "alchemy-sdk";

export function useRecentTransactions() {
  const [fromTransfers, setFromTransfers] = useState<AssetTransfersWithMetadataResult[] | null>(null);
  const [toTransfers, setToTransfers] = useState<AssetTransfersWithMetadataResult[] | null>(null);
  const account = useSafeLightAccount();
  const { sdkClient } = useAccountContext();

  useEffect(() => {
    sdkClient.core
      .getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: account.address,
        category: [
          AssetTransfersCategory.ERC1155,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.EXTERNAL,
        ],
        withMetadata: true,
      })
      .then((transfersResponse) => {
        setFromTransfers(transfersResponse.transfers);
      });

    sdkClient.core
      .getAssetTransfers({
        fromBlock: "0x0",
        toAddress: account.address,
        category: [
          AssetTransfersCategory.ERC1155,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.EXTERNAL,
        ],
        withMetadata: true,
      })
      .then((transfersResponse) => {
        setToTransfers(transfersResponse.transfers);
      });
  }, [account.address]);

  return {
    toTransfers,
    fromTransfers,
  };
}
