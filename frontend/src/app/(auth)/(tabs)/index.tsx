import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View, RefreshControl, Pressable } from "react-native";
import { ActivityIndicator, Card, FAB, Text } from "react-native-paper";
import { useBalance } from "../../../hooks/useBalance";
import { useRecentTransactions } from "../../../hooks/useRecentTransactions";
import styles from "../../../styles/styles";
import { useAuthContext } from "../../../providers/AuthProvider";
import MovementsList from "../../../components/MovementsList/MovementsList";
import { useAccountContext } from "../../../hooks/useAccountContext";
import UserInfo from "../../../components/UserInfo/UserInfo";

const formatBalance = (balance: number | null, significantFigures: number) => {
  if (balance == null) return "N/A";
  const formattedBalance = balance.toPrecision(significantFigures);
  return formattedBalance;
};

const HomeScreen: React.FC = () => {
  const { data: balance, isLoading, refetch, isRefetching } = useBalance();
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refreshTransactions,
    isRefetching: isRefetchingTransactions,
  } = useRecentTransactions();
  const { user } = useAuthContext();
  const [isDeployed, setIsDeployed] = useState(false);
  const { lightAccount, initiator } = useAccountContext(); // Get contractDeployed from AccountContext

  const account = lightAccount || initiator;

  useEffect(() => {
    if (account) {
      account.account
        .isAccountDeployed()
        .then((isDeployed) => setIsDeployed(isDeployed));
    }
  }, [account]);

  const onRefresh = () => {
    refetch();
    refreshTransactions();
  };
  const refreshing = isRefetching || isRefetchingTransactions;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <UserInfo
          email={`${user?.email}`}
          contractDeployed={isDeployed}
          publicAddress={account!.getAddress()}
        />
        <Card style={styles.genericCard}>
          <Card.Title title="Balance" titleVariant="titleLarge" />
          <Card.Content>
            {!isLoading && balance ? (
              <Text testID="home-balance" style={styles.balance}>
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
          <View style={{ alignItems: "center" }}>
            <FAB
              testID="home-contacts-button"
              size="medium"
              icon="contacts"
              variant="secondary"
              onPress={() => router.push({ pathname: "contacts" })}
            />
            <Text style={{ textAlign: "center", marginTop: 8 }}>Contacts</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <FAB
              size="medium"
              icon="qrcode"
              variant="secondary"
              onPress={() => router.push({ pathname: "scanner" })}
            />
            <Text style={{ textAlign: "center", marginTop: 8 }}>
              Scan QR Code
            </Text>
          </View>
        </View>

        <Card style={styles.genericCard}>
          <Card.Title title="Transaction History" titleVariant="titleMedium" />
          <Card.Content>
            <MovementsList
              toTransfers={transactionsData?.toTransfers ?? []}
              fromTransfers={transactionsData?.fromTransfers ?? []}
              maxRows={4}
            />
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/transaction-history",
                });
              }}
            >
              <Text variant="bodyMedium" style={{ margin: 8 }}>
                See all history
              </Text>
            </Pressable>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
