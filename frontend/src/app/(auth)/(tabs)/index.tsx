import { Link } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { ActivityIndicator, Avatar, Card, FAB, Text } from "react-native-paper";
import { useBalance } from "../../../hooks/useBalance";
import { useRecentTransactions } from "../../../hooks/useRecentTransactions";
import styles from "../../../styles/styles";
import { useAuthContext } from "../../../providers/AuthProvider";
import MovementsList from "../../../components/movementsList/movementsList";
import { useFocusEffect } from "@react-navigation/native";
import { useAccountContext } from "../../../hooks/useAccountContext";

const formatBalance = (balance: number | null, significantFigures: number) => {
  if (balance == null) return "N/A";
  const formattedBalance = balance.toPrecision(significantFigures);
  return formattedBalance;
};

const HomeScreen: React.FC = () => {
  const { balance, refreshData } = useBalance();
  const { fromTransfers, toTransfers, refreshTransactions } = useRecentTransactions();
  const { user } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const { contractDeployed } = useAccountContext(); // Get contractDeployed from AccountContext

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshData(), refreshTransactions()]);
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, [])
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          <Avatar.Icon
            style={[
              styles.userSettings,
              {
                backgroundColor: contractDeployed ? "green" : "gray",
              },
            ]}
            size={30}
            icon="account"
            color="white"
          />
          <Text style={{ flex: 1, left: 50 }} variant="titleLarge">{`${user?.email}`}</Text>
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
