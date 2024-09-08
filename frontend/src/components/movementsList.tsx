import { AssetTransfersWithMetadataResult } from "alchemy-sdk";
import React, { Key } from "react";
import { ColorValue, View } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";
import { router } from "expo-router";

interface MovementsListProps {
  toTransfers: AssetTransfersWithMetadataResult[] | null;
  fromTransfers: AssetTransfersWithMetadataResult[] | null;
}

const formatTxAddress = (address: string | null) => {
  return address ? `${address.slice(0, 10)}...${address.slice(30)}` : "N/A";
};

const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

const EthereumTransactionItem = (
  transfer: AssetTransfersWithMetadataResult,
  index: Key,
  color: ColorValue,
  addressField: "from" | "to",
  isOutgoing: boolean
) => {
  const address = transfer[addressField] || "N/A";
  const displayValue = isOutgoing ? `-${transfer.value}` : `+${transfer.value}`;

  const timestamp = transfer.metadata?.blockTimestamp;

  return (
    <List.Item
      title={`${formatTxAddress(address)}`}
      titleStyle={{ fontSize: 15 }}
      description={`${formatTimestamp(timestamp)}`}
      descriptionStyle={{ fontSize: 11 }}
      key={index}
      onPress={() =>
        router.push({
          pathname: `transaction`,
          params: { txHash: transfer.hash },
        })
      }
      right={() => <Text style={{ color: color }}>{displayValue}</Text>}
    />
  );
};

const MovementsList: React.FC<MovementsListProps> = ({ toTransfers, fromTransfers }) => {
  const combinedTransfers = [
    ...(fromTransfers?.map(transfer => ({ ...transfer, isOutgoing: true })) || []),
    ...(toTransfers?.map(transfer => ({ ...transfer, isOutgoing: false })) || [])
  ];

  const sortedTransfers = combinedTransfers.sort((a, b) => {
    const timestampA = new Date(a.metadata?.blockTimestamp || 0).getTime();
    const timestampB = new Date(b.metadata?.blockTimestamp || 0).getTime();
    return timestampB - timestampA;
  });

  return (
    <List.Section>
      {!sortedTransfers.length ? (
        <ActivityIndicator />
      ) : (
        sortedTransfers.map((transfer, index) =>
          EthereumTransactionItem(
            transfer,
            `transfer_${index}`,
            transfer.isOutgoing ? "red" : "green", 
            transfer.isOutgoing ? "to" : "from",
            transfer.isOutgoing
          )
        )
      )}
    </List.Section>
  );
};

export default MovementsList;
