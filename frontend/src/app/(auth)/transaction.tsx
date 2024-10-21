import React from 'react';
import { useGetTransactioDetail } from "../../hooks/useGetTransactioDetail";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Linking } from "react-native";
import { ActivityIndicator, Card, Text, FAB } from "react-native-paper";
import { useBlockchainContext } from "../../providers/BlockchainProvider";
import styles from "../../styles/styles";
import { router } from "expo-router";

const TransactionScreen: React.FC = () => {
  const { txHash, isNew } = useLocalSearchParams<{ txHash?: string, isNew?: string }>();
  const { transaction, loading } = useGetTransactioDetail(txHash ? txHash : "");

  const { blockchain } = useBlockchainContext();
  const blockExplorerUrl = blockchain.block_explorer;

  const openEtherscan = () => {
    if (txHash) {
      const url = `${blockExplorerUrl}${txHash}`;
      Linking.openURL(url);
    }
  };

  const isNewParam = isNew === "true";

  return (
    <View style={[styles.container, { flex: 1, justifyContent: 'center', paddingHorizontal: 16 }]}>
      {!isNewParam && (
        <Stack.Screen
          options={{
            title: "Transaction details",
            headerStyle: { backgroundColor: "#277ca5" },
            headerShown: true,
            headerTintColor: "#fff",
            headerBackTitleVisible: false,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : transaction ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Card style={{ width: '100%', marginBottom: 24 }}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.item}>
                Hash:{" "}
              </Text>
              <Text variant="bodySmall" selectable style={styles.item}>
                {transaction.hash}
              </Text>
              <Text variant="titleMedium" style={styles.item}>
                From:{" "}
              </Text>
              <Text testID='transaction-from' variant="bodySmall" selectable style={styles.item}>
                {transaction.from}
              </Text>
              <Text variant="titleMedium" style={styles.item}>
                To:{" "}
              </Text>
              <Text testID='transaction-to' variant="bodySmall" selectable style={styles.item}>
                {transaction.to}
              </Text>
              <Text variant="titleMedium" style={styles.item}>
                Block Number:{" "}
              </Text>
              <Text testID='transaction-block-number' variant="bodyMedium" style={styles.item}>
                {transaction.blockNumber}
              </Text>
              <Text variant="titleMedium" style={styles.item}>
                Value:{" "}
              </Text>
              <Text variant="bodyMedium" style={styles.item}>
                {transaction.value.toString()}
              </Text>
              <Text variant="titleMedium" style={styles.item}>
                Gas Used:{" "}
              </Text>
              <Text variant="bodyMedium" style={styles.item}>
                {transaction.gasLimit.toString()}
              </Text>
              <Text variant="titleMedium" style={styles.item}>
                Gas Price:{" "}
              </Text>
              <Text variant="bodyMedium" style={styles.item}>
                {transaction.gasPrice?.toString()}
              </Text>
            </Card.Content>
          </Card>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
            <FAB
              size="medium"
              icon="link-variant"
              style={[styles.fab, { marginRight: 16 }]}
              onPress={openEtherscan}
            />
            {isNewParam && (
              <FAB
                testID='go-to-home-button'
                size="medium"
                icon="home"
                style={styles.fab}
                onPress={() => { router.navigate('/(auth)'); }}
              />
            )}
          </View>
        </View>
      ) : (
        <Text variant="titleMedium" style={styles.item}>
          No transaction found.
        </Text>
      )}
    </View>
  );
};

export default TransactionScreen;
