import { AssetTransfersResult } from "alchemy-sdk";
import { Link } from "expo-router";
import React, { Key } from "react";
import {
  ColorValue,
  ScrollView,
  View
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Card,
  FAB,
  List,
  Text,
} from "react-native-paper";
import { useBalance } from "../../../hooks/useBalance";
import { useRecentTransactions } from "../../../hooks/useRecentTransactions";
import styles from "../../../styles/styles";

const formatTxAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(36)}`;
};

const EthereumTransactionItem = (
  transfer: AssetTransfersResult,
  index: Key,
  color: ColorValue
) => (
  <List.Item
    title={`From: ${formatTxAddress(transfer.from)}`}
    titleStyle={{ fontSize: 12 }}
    description={`To block: ${transfer.blockNum}`}
    descriptionStyle={{ fontSize: 12 }}
    key={index}
    right={() => <Text style={{ color: color }}>{transfer.value}</Text>}
  />
);

const HomeScreen: React.FC = () => {
  const balance = useBalance();
  const { fromTransfers, toTransfers } = useRecentTransactions();

  return (
    <ScrollView>
      <Avatar.Icon style={styles.userSettings} size={30} icon="account" />
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceHeader}>Balance</Text>
        {balance !== null ? (
          <Text style={styles.balance}>{balance?.toString()} eth</Text>
        ) : (
          <ActivityIndicator />
        )}
        <Link href="balance" style={styles.seeAll}>
          <Text>See all</Text>
        </Link>
      </View>
      <View style={styles.keyFeatures}>
        <FAB size="small" icon="bank-transfer" />
        <FAB size="small" icon="cash-plus" />
        <FAB size="small" icon="cash-minus" />
        <FAB size="small" icon="account-cash-outline" />
      </View>
      <Card style={styles.movementsContainer}>
        <List.Section>
          <List.Subheader key={"Movements"}>Movements</List.Subheader>
          <List.Subheader key={"Received"}>Received</List.Subheader>
          {!toTransfers && <ActivityIndicator />}
          {toTransfers &&
            toTransfers.map((transfer, index) =>
              EthereumTransactionItem(transfer, `to_transfer_${index}`, "green")
            )}
          <List.Subheader key={"Sent"}>Sent</List.Subheader>
          {!fromTransfers && <ActivityIndicator />}
          {fromTransfers &&
            fromTransfers.map((transfer, index) =>
              EthereumTransactionItem(transfer, `from_transfer_${index}`, "red")
            )}
        </List.Section>
      </Card>
    </ScrollView>
  );
};

export default HomeScreen;
