import { AssetTransfersWithMetadataResult } from "alchemy-sdk";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Avatar, Card, FAB, Text } from "react-native-paper";
import { useBalance } from "../../../hooks/useBalance";
import { useRecentTransactions } from "../../../hooks/useRecentTransactions";
import styles from "../../../styles/styles";
import { useAuthContext } from "../../../providers/AuthProvider";
import MovementsList from "../../../components/movementsList";

const formatBalance = (balance: number | null, significantFigures: number) => {
  if (balance == null) return "N/A";
  const formattedBalance = balance.toPrecision(significantFigures);
  return formattedBalance;
};

const HomeScreen: React.FC = () => {
  const { balance } = useBalance();
  const { fromTransfers, toTransfers } = useRecentTransactions();
  const { user } = useAuthContext();

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          <Avatar.Icon style={styles.userSettings} size={30} icon="account" />
          <Text variant="titleLarge">{`Hi ${user?.email}!`}</Text>
        </View>

        <Card style={styles.movementsCard} mode="contained">
          <Card.Content>
            <Text variant="titleLarge">Balance</Text>
            {balance !== null ? (
              <Text style={styles.balance}>
                {formatBalance(parseFloat(balance), 4)} ETH
              </Text>
            ) : (
              <ActivityIndicator />
            )}

            <Link href="balance" style={styles.seeAll}>
              <Text variant="titleSmall">See all</Text>
            </Link>
          </Card.Content>
        </Card>

        <View style={styles.horizontalContainer}>
          <FAB size="small" icon="bank-transfer" variant="secondary" />
          <FAB size="small" icon="cash-plus" variant="secondary" />
          <FAB size="small" icon="cash-minus" variant="secondary" />
          <FAB size="small" icon="account-cash-outline" variant="secondary" />
        </View>

        <Card style={styles.movementsCard} mode="elevated">
          <Card.Content>
            <Card.Title title="Transaction History" />
            <MovementsList
              toTransfers={toTransfers}
              fromTransfers={fromTransfers}
              maxRows={4}
            />
            <Link href="/(auth)/transaction_history" push>
              <Text variant="bodyMedium" style={{ margin: 8 }}>
                See all history
              </Text>
            </Link>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
