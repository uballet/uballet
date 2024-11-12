import { useEffect } from "react";
import { View } from "react-native";
import { useTransfer } from "../../../hooks/useTransfer";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import { Text, Card } from "react-native-paper";
import styles from "../../../styles/styles";
import { theme } from "../../../styles/color";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import TransferButton from "../../../components/TransferButton/TransferButton";

function SubmitTransferScreen() {
  const {
    toAddress,
    amount,
    currency,
    usdcTokenGas,
    gasEstimation,
    isSponsored,
  } = useLocalSearchParams<{
    toAddress: `0x${string}`;
    amount: string;
    currency: string;
    usdcTokenGas?: string;
    gasEstimation?: string;
    isSponsored?: boolean;
  }>();

  const eth_symbol = "ETH";

  const currencyScanned = useLocalSearchParams<{ currency: string }>()
    ?.currency;
  const addressScanned = useLocalSearchParams<{ address: string }>()?.address;
  const amountScanned = useLocalSearchParams<{ amount: string }>()?.amount;

  const { transfer, loading, error, setError, txHash } = useTransfer();

  const { blockchain } = useBlockchainContext();

  const tokens = blockchain.erc20_tokens;
  const tokenAddresses = tokens.reduce<{ [key: string]: `0x${string}` }>(
    (acc, token) => {
      acc[token.symbol] = token.address as `0x${string}`;
      return acc;
    },
    {}
  );

  console.log("Gas Estimation: ", gasEstimation);

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
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{ paddingHorizontal: 20, marginTop: 4, alignItems: "stretch" }}
      >
        <Card style={{ marginVertical: 12 }}>
          <Card.Content>
            {/* Summary */}
            <Text style={{ ...styles.summaryText, color: "black" }}>
              Transaction summary
            </Text>

            {/* To Address */}
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold" }}>To Address:</Text>
              </Text>
              <Text style={{ ...styles.infoText, color: "gray" }}>
                {toAddress}
              </Text>
            </View>

            {/* Amount */}
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold" }}>Amount and currency:</Text>
              </Text>
              <Text style={{ ...styles.infoText, color: "gray" }}>
                {amount} {currency}
              </Text>
            </View>

            {/* Gas */}
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold" }}>Transaction Gas:</Text>
              </Text>
              {usdcTokenGas ? (
                <Text style={{ ...styles.infoText, color: "gray" }}>
                  {usdcTokenGas} USDC
                </Text>
              ) : isSponsored ? (
                <Text style={{ ...styles.infoText, color: "gray" }}>
                  Transaction gas will be sponsored by us!
                </Text>
              ) : (
                <Text style={{ ...styles.infoText, color: "gray" }}>
                  {gasEstimation} ETH
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Transfer Button at the Bottom */}
      <View
        testID="transfer-submit-button"
        style={{
          paddingBottom: 4,
          paddingHorizontal: 0,
          alignItems: "center",
          marginHorizontal: 16,
        }}
      >
        <TransferButton
          currency={currency}
          ethSymbol={eth_symbol}
          loading={loading}
          onTransferETH={() =>
            transfer({ address: toAddress, amount, gasInUsdc: usdcTokenGas })
          }
          onTransferToken={() =>
            transfer({
              address: toAddress,
              tokenAddress: tokenAddresses[currency],
              amount,
              gasInUsdc: usdcTokenGas,
            })
          }
        />
      </View>
    </View>
  );
}

export default SubmitTransferScreen;
