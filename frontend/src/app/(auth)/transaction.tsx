import React from "react";
import { useGetTransactioDetail } from "../../hooks/useGetTransactionDetail";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Linking, Share } from "react-native";
import {
  ActivityIndicator,
  Card,
  Text,
  FAB,
  IconButton,
} from "react-native-paper";
import { useBlockchainContext } from "../../providers/BlockchainProvider";
import styles from "../../styles/styles";
import { router } from "expo-router";
import { useAccountContext } from "../../hooks/useAccountContext";
import * as Clipboard from "expo-clipboard";
import { formatUnits } from "ethers";
import UballotSpinner from "../../components/UballetSpinner/UballetSpinner";

const TransactionScreen: React.FC = () => {
  const { txHash, isNew } = useLocalSearchParams<{
    txHash?: string;
    isNew?: string;
  }>();
  const { transaction, loading } = useGetTransactioDetail(txHash ? txHash : "");

  const { blockchain } = useBlockchainContext();
  const blockExplorerUrl = blockchain.block_explorer;

  const { lightAccount, initiator } = useAccountContext();

  const account = lightAccount || initiator;
  const publicKey = account!.getAddress();

  const openEtherscan = () => {
    if (txHash) {
      const url = `${blockExplorerUrl}${txHash}`;
      Linking.openURL(url);
    }
  };

  const isNewParam = isNew === "true";

  const isInternalTransaction =
    transaction &&
    transaction.from !== publicKey &&
    transaction.to !== publicKey;

  const handleCopyToClipboard = (address: string) => {
    Clipboard.setStringAsync(address);
  };

  const shareBlockExplorerLink = async () => {
    if (txHash) {
      const url = `${blockExplorerUrl}${txHash}`;
      try {
        await Share.share({
          message: `Check out this transaction: ${url}`,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  return (
    <View style={[styles.container, { flex: 1, justifyContent: "center" }]}>
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
        <UballotSpinner />
      ) : transaction ? (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Card style={{ width: "100%" }}>
            <Card.Content>
              {isInternalTransaction && (
                <Text
                  style={{
                    color: "orange",
                    fontWeight: "bold",
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  This transaction is internal. Internal transactions are
                  behind-the-scenes actions in smart contracts. Check the block
                  explorer below for more details on recipients and amounts.
                </Text>
              )}
              <Text variant="titleMedium" style={styles.item}>
                Hash:{" "}
              </Text>
              <Text variant="bodySmall" selectable style={styles.item}>
                {transaction.hash}
              </Text>
              <Text variant="titleMedium" style={styles.item}>
                From:{" "}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  testID="transaction-from"
                  variant="bodySmall"
                  selectable
                  style={styles.item}
                >
                  {transaction.from}
                </Text>
                <IconButton
                  icon="content-copy"
                  size={20}
                  onPress={() => handleCopyToClipboard(transaction.from)}
                  accessibilityLabel="Copy from address"
                />
              </View>
              <Text variant="titleMedium" style={styles.item}>
                To:{" "}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  testID="transaction-to"
                  variant="bodySmall"
                  selectable
                  style={styles.item}
                >
                  {transaction.to}
                </Text>
                <IconButton
                  icon="content-copy"
                  size={20}
                  onPress={() =>
                    transaction.to && handleCopyToClipboard(transaction.to)
                  }
                  accessibilityLabel="Copy to address"
                />
              </View>
              <Text variant="titleMedium" style={styles.item}>
                Block Number:{" "}
              </Text>
              <Text
                testID="transaction-block-number"
                variant="bodyMedium"
                style={styles.item}
              >
                {transaction.blockNumber}
              </Text>
              {transaction.value.gt(0) && (
                <>
                  <Text variant="titleMedium" style={styles.item}>
                    Value:{" "}
                  </Text>
                  <Text variant="bodyMedium" style={styles.item}>
                    {formatUnits(transaction.value.toString(), 18)}
                  </Text>
                </>
              )}
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

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <FAB
              size="medium"
              icon="link-variant"
              style={[styles.fab, { marginRight: 16 }]}
              onPress={openEtherscan}
            />
            {isNewParam && (
              <FAB
                testID="go-to-home-button"
                size="medium"
                icon="home"
                style={[styles.fab, { marginRight: 16 }]}
                onPress={() => {
                  router.navigate("/(auth)");
                }}
              />
            )}
            <FAB
              testID="share-button"
              size="medium"
              icon="share"
              style={styles.fab}
              onPress={shareBlockExplorerLink}
            />
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
