import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { AssetTransfersCategory, AssetTransfersWithMetadataResult } from "alchemy-sdk";

export function useRecentTransactions() {
  const [fromTransfers, setFromTransfers] = useState<AssetTransfersWithMetadataResult[] | null>(null);
  const [toTransfers, setToTransfers] = useState<AssetTransfersWithMetadataResult[] | null>(null);
  const { sdkClient, lightAccount, initiator } = useAccountContext();
  const account = initiator || lightAccount;
  useEffect(() => {
    sdkClient.core
      .getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: account!.getAddress(),
        category: [
          AssetTransfersCategory.ERC1155,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.INTERNAL,
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
        toAddress: account!.getAddress(),
        category: [
          AssetTransfersCategory.ERC1155,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.INTERNAL,
          AssetTransfersCategory.EXTERNAL,
        ],
        withMetadata: true,
      })
      .then((transfersResponse) => {
        setToTransfers(transfersResponse.transfers);
      });
  }, [account?.getAddress()]);

  return {
    toTransfers,
    fromTransfers,
  };
}
