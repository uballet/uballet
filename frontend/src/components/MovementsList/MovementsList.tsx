import { AssetTransfersWithMetadataResult } from "alchemy-sdk";
import React, { Key } from "react";
import { ColorValue, View, StyleSheet, TextStyle } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";
import { useContacts } from "../../hooks/contacts/useContacts";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface MovementsListProps {
  toTransfers: AssetTransfersWithMetadataResult[] | null;
  fromTransfers: AssetTransfersWithMetadataResult[] | null;
  maxRows?: number;
}

const formatTxAddress = (
  address: string | null,
  contacts: Array<{ id: string; name: string; address: string }>
) => {
  if (!address) return "N/A";
  const contact = contacts.find(
    (contact) => contact.address.toLowerCase() === address.toLowerCase()
  );
  return contact
    ? contact.name
    : `${address.slice(0, 7)}...${address.slice(37, 42)}`;
};

const formatTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const formatValue = (value: string | number, significantFigures: number) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return value;

  let formattedValue: string;

  // Case 1: Value >= 1, format with up to 4 decimal places, remove trailing zeros
  if (numValue >= 1) {
    formattedValue = numValue
      .toFixed(4)
      .replace(/(\.0+|(\.\d*?[1-9])0+)$/, "$2");
  }
  // Case 2: Value < 1, format with up to the given number of significant figures
  else {
    formattedValue = numValue
      .toPrecision(significantFigures)
      .replace(/(\.\d*?[1-9])0+$/, "$1")
      .replace(/\.$/, "");
  }

  return formattedValue;
};

const EthereumTransactionItem = (
  transfer: AssetTransfersWithMetadataResult,
  index: Key,
  color: ColorValue,
  addressField: "from" | "to",
  isOutgoing: boolean,
  contacts: Array<{ id: string; name: string; address: string }>
) => {
  const address = transfer[addressField] || "N/A";
  const rawValue = transfer.value != null ? transfer.value : 0;
  const displayValue = isOutgoing
    ? `-${formatValue(rawValue, 4)}`
    : `+${formatValue(rawValue, 4)}`;
  const tokenName = transfer.asset || "Unknown";
  const timestamp = transfer.metadata?.blockTimestamp;

  const backgroundColor = isOutgoing ? "#FFEAE9" : "#E8FEFF";
  const valueStyle: TextStyle = {
    fontSize: 18,
    color: isOutgoing ? color : color,
    fontWeight: isOutgoing ? "normal" : "normal",
  };

  return (
    <List.Item
      testID="transaction-item"
      className="border border-gray-200"
      title={`${formatTxAddress(address, contacts)}`}
      titleStyle={{ fontSize: 18 }}
      description={`${formatTimestamp(timestamp)}`}
      descriptionStyle={{ fontSize: 10 }}
      key={index}
      onPress={() =>
        router.push({
          pathname: `transaction`,
          params: { txHash: transfer.hash },
        })
      }
      style={[{ backgroundColor }]}
      left={() => (
        <List.Icon
          style={{ marginRight: -8, marginLeft: 8 }}
          icon={() =>
            isOutgoing ? (
              <MaterialCommunityIcons
                name="arrow-up-bold"
                size={20}
                color="red"
              />
            ) : (
              <MaterialCommunityIcons
                name="arrow-down-bold"
                size={20}
                color="green"
              />
            )
          }
        />
      )}
      right={() => (
        <Text style={valueStyle}>
          {displayValue} {tokenName}
        </Text>
      )}
    />
  );
};

const MovementsList: React.FC<MovementsListProps> = ({
  toTransfers,
  fromTransfers,
  maxRows,
}) => {
  const { contacts, isLoading } = useContacts();

  const combinedTransfers = [
    ...(fromTransfers?.map((transfer) => ({ ...transfer, isOutgoing: true })) ||
      []),
    ...(toTransfers?.map((transfer) => ({ ...transfer, isOutgoing: false })) ||
      []),
  ];

  const sortedTransfers = combinedTransfers.sort((a, b) => {
    const timestampA = new Date(a.metadata?.blockTimestamp || 0).getTime();
    const timestampB = new Date(b.metadata?.blockTimestamp || 0).getTime();
    return timestampB - timestampA;
  });

  const displayedTransfers = maxRows
    ? sortedTransfers.slice(0, maxRows)
    : sortedTransfers;

  return (
    <List.Section>
      {isLoading ? (
        <ActivityIndicator testID="activity-indicator" />
      ) : !sortedTransfers.length ? (
        <View style={{ padding: 8 }}>
          <Text style={{ fontSize: 14, color: "gray" }}>
            No transactions found
          </Text>
        </View>
      ) : (
        displayedTransfers.map((transfer, index) =>
          EthereumTransactionItem(
            transfer,
            `transfer_${index}`,
            transfer.isOutgoing ? "red" : "green",
            transfer.isOutgoing ? "to" : "from",
            transfer.isOutgoing,
            contacts || []
          )
        )
      )}
    </List.Section>
  );
};

export default MovementsList;
