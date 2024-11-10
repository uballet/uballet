import { useEffect } from "react";
import { View } from "react-native";
import { useTransfer } from "../../../hooks/useTransfer";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import { Text, Card } from "react-native-paper";
import styles from "../../../styles/styles";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import TransferButton from "../../../components/TransferButton/TransferButton";

function SubmitTransferScreen() {
  const { toAddress, amount, currency, usdcTokenGas } = useLocalSearchParams<{
    toAddress: `0x${string}`;
    amount: string;
    currency: string;
    usdcTokenGas?: string;
  }>();

  const eth_symbol = "ETH";

  const currencyScanned = useLocalSearchParams<{ currency: string }>()
    ?.currency;
  const addressScanned = useLocalSearchParams<{ address: string }>()?.address;
  const amountScanned = useLocalSearchParams<{ amount: string }>()?.amount;

  const {
    transfer,
    loading,
    error,
    setError,
    txHash,
  } = useTransfer();

  const { blockchain } = useBlockchainContext();
  const tokens = blockchain.erc20_tokens;
  const tokenAddresses = tokens.reduce<{ [key: string]: `0x${string}` }>(
    (acc, token) => {
      acc[token.symbol] = token.address as `0x${string}`;
      return acc;
    },
    {}
  );

  useEffect(() => {
    if (error == "waitForUserOperationTransaction") {
      router.push({
        pathname: `transfer/pending-transaction`,
      });
    }
  }, [error]);

  useEffect(() => {
    if (txHash) {
      setError("");
      router.push({
        pathname: `transaction`,
        params: { txHash: txHash, isNew: "true" },
      });
    }
  }, [txHash, currencyScanned, addressScanned, amountScanned]);

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Card style={{ width: "100%" }}>
          <Card.Content>
            {/* Summary */}
            <Text style={[styles.summaryText]}>Summary</Text>

            {/* To Address */}
            <View style={{ marginVertical: 8 }}>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold" }}>To Address:</Text>
              </Text>
              <Text style={styles.infoText}>{toAddress}</Text>
            </View>

            {/* Amount */}
            <View style={{ marginVertical: 8 }}>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold" }}>Amount:</Text>
              </Text>
              <Text style={styles.infoText}>
                {amount} {currency}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Transfer Button at the Bottom */}
      <View
        style={{ paddingBottom: 20, alignItems: "center" }}
        testID="transfer-submit-button"
        className="px-5"
      >
        <TransferButton
          currency={currency}
          ethSymbol={eth_symbol}
          loading={loading}

          onTransferETH={() => transfer({ address: toAddress, amount, gasInUsdc: usdcTokenGas })}
          onTransferToken={() =>
            transfer({ address: toAddress, tokenAddress: tokenAddresses[currency], amount, gasInUsdc: usdcTokenGas })
          }
        />
      </View>
    </View>
  );
}

export default SubmitTransferScreen;
