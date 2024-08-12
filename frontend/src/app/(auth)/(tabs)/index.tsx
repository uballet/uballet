import { AssetTransfersResult } from "alchemy-sdk";
import { Link } from "expo-router";
import React, { Key } from "react";
import { ColorValue, ScrollView, View } from "react-native";
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
import { useAuthContext } from "../../../providers/AuthProvider";

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
    right={() => <Text style={{ color: color }}>{transfer.value}</Text>}
  />
);

const HomeScreen: React.FC = () => {
  const balance = useBalance();
  const { fromTransfers, toTransfers } = useRecentTransactions();
  const { user } = useAuthContext()

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          <Avatar.Icon style={styles.userSettings} size={30} icon="account" />
          <Text variant="titleLarge">{`Hola ${user?.email}`}</Text>
        </View>
        <Card style={styles.movementsCard} mode="contained">
          <Card.Content>
            <Text variant="titleLarge">Balance</Text>
            {balance !== null ? (
              <Text style={styles.balance}>{balance?.toString()} ETH</Text>
            ) : (
              <ActivityIndicator />
            )}

            <Link href="balance" style={styles.seeAll}>
              <Text variant="titleSmall">See all</Text>
            </Link>
          </Card.Content>
        </Card>

        <View style={styles.horizontalContainer}>
          <FAB size="small" icon="bank-transfer" variant="tertiary" />
          <FAB size="small" icon="cash-plus" variant="tertiary" />
          <FAB size="small" icon="cash-minus" variant="tertiary" />
          <FAB size="small" icon="account-cash-outline" variant="tertiary" />
        </View>
        <Card style={styles.movementsCard} mode="elevated">
          <Card.Content>
            <Card.Title title="Movements" />
            <List.Section>
              <List.Subheader key={"Received"}>Received</List.Subheader>
              {!toTransfers && <ActivityIndicator />}
              {toTransfers &&
                toTransfers.map((transfer, index) =>
                  EthereumTransactionItem(
                    transfer,
                    `to_transfer_${index}`,
                    "green"
                  )
                )}
              <List.Subheader key={"Sent"}>Sent</List.Subheader>
              {!fromTransfers && <ActivityIndicator />}
              {fromTransfers &&
                fromTransfers.map((transfer, index) =>
                  EthereumTransactionItem(
                    transfer,
                    `from_transfer_${index}`,
                    "red"
                  )
                )}
            </List.Section>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
