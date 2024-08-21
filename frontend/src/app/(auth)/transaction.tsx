import { useGetTransactioDetail } from "../../hooks/useGetTransactioDetail";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import styles from "../../styles/styles";

const TransactionScreen: React.FC = () => {
  const { txHash } = useLocalSearchParams<{ txHash?: string }>();
  const { transaction, loading } = useGetTransactioDetail(txHash ? txHash : "");

  return (
    <View style={styles.container}>
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
      {loading ? (
        <ActivityIndicator size="large" />
      ) : transaction ? (
        <Card>
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
            <Text variant="bodySmall" selectable style={styles.item}>
              {transaction.from}
            </Text>
            <Text variant="titleMedium" style={styles.item}>
              To:{" "}
            </Text>
            <Text variant="bodySmall" selectable style={styles.item}>
              {transaction.to}
            </Text>
            <Text variant="titleMedium" style={styles.item}>
              Block Number:{" "}
            </Text>
            <Text variant="bodyMedium" style={styles.item}>
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
      ) : (
        <Text variant="titleMedium" style={styles.item}>
          No transaction found.
        </Text>
      )}
    </View>
  );
};

export default TransactionScreen;
