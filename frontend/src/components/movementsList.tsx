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

const EthereumTransactionItem = (
  transfer: AssetTransfersWithMetadataResult,
  index: Key,
  color: ColorValue,
  addressField: "from" | "to",
  isOutgoing: boolean
) => {
  const address = transfer[addressField] || "N/A";
  const displayValue = isOutgoing ? `-${transfer.value}` : transfer.value;

  const timestamp = transfer.metadata?.blockTimestamp || "Unknown";

  return (
    <List.Item
      title={`${formatTxAddress(address)}`}
      titleStyle={{ fontSize: 12 }}
      description={`Timestamp: ${timestamp}`} // Show metadata like timestamp
      descriptionStyle={{ fontSize: 12 }}
      key={index}
      onPress={() =>
        router.push({
          pathname: `transaction`,
          params: { txHash: transfer.hash },
        })
      }
      right={() => <Text style={{ color: color }}>{displayValue}</Text>} // Apply the displayValue
    />
  );
};

const MovementsList: React.FC<MovementsListProps> = ({ toTransfers, fromTransfers }) => {
  return (
    <List.Section>
      <List.Subheader key={"Received"}>Received</List.Subheader>
      {!toTransfers ? (
        <ActivityIndicator />
      ) : (
        toTransfers.map((transfer, index) =>
          EthereumTransactionItem(transfer, `to_transfer_${index}`, "green", "from", false) // "false" for received transfers
        )
      )}

      <List.Subheader key={"Sent"}>Sent</List.Subheader>
      {!fromTransfers ? (
        <ActivityIndicator />
      ) : (
        fromTransfers.map((transfer, index) =>
          EthereumTransactionItem(transfer, `from_transfer_${index}`, "red", "to", true) // "true" for sent transfers
        )
      )}
    </List.Section>
  );
};

export default MovementsList;
