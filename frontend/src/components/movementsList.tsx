import { AssetTransfersResult } from "alchemy-sdk";
import React, { Key } from "react";
import { ColorValue, View } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";
import { router } from "expo-router";

interface MovementsListProps {
  toTransfers: AssetTransfersResult[] | null;
  fromTransfers: AssetTransfersResult[] | null;
}

const formatTxAddress = (address: string) => {
  return `${address.slice(0, 10)}...${address.slice(30)}`;
};

const EthereumTransactionItem = (
  transfer: AssetTransfersResult,
  index: Key,
  color: ColorValue
) => (
  <List.Item
    title={`From: ${formatTxAddress(transfer.from)}`}
    titleStyle={{ fontSize: 12 }}
    description={
      `In block: ${transfer.blockNum}` +
      "\n" +
      `Tx ID: ${formatTxAddress(transfer.uniqueId)}`
    }
    descriptionStyle={{ fontSize: 12 }}
    key={index}
    onPress={() =>
      router.push({
        pathname: `transaction`,
        params: { txHash: transfer.hash },
      })
    }
    right={() => <Text style={{ color: color }}>{transfer.value}</Text>}
  />
);

const MovementsList: React.FC<MovementsListProps> = ({ toTransfers, fromTransfers }) => {
  return (
    <List.Section>
      <List.Subheader key={"Received"}>Received</List.Subheader>
      {!toTransfers ? (
        <ActivityIndicator />
      ) : (
        toTransfers.map((transfer, index) =>
          EthereumTransactionItem(transfer, `to_transfer_${index}`, "green")
        )
      )}
      
      <List.Subheader key={"Sent"}>Sent</List.Subheader>
      {!fromTransfers ? (
        <ActivityIndicator />
      ) : (
        fromTransfers.map((transfer, index) =>
          EthereumTransactionItem(transfer, `from_transfer_${index}`, "red")
        )
      )}
    </List.Section>
  );
};

export default MovementsList;
