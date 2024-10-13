import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useTransfer } from "../../../hooks/useTransfer";
import { useCheckTransferSponsorship } from "../../../hooks/useCheckTransferSponsorship";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import { Text, Button, Card } from "react-native-paper";
import styles from "../../../styles/styles";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";

function SubmitTransferScreen() {
  const { toAddress, amount, currency } = useLocalSearchParams<{ 
    toAddress: `0x${string}`, 
    amount: string, 
    currency: string 
  }>();

  const eth_symbol = "ETH";

  const currencyScanned = useLocalSearchParams<{ currency: string }>()?.currency;
  const addressScanned = useLocalSearchParams<{ address: string }>()?.address;
  const amountScanned = useLocalSearchParams<{ amount: string }>()?.amount;
  
  const [isAmountValid, setIsAmountValid] = useState(true);
  const {
    transferToAddress,
    transferTokenToAddress,
    loading,
    error,
    setError,
    txHash,
  } = useTransfer();
  const {
    loading: loadingSponsorship,
    setIsSponsored,
    isSponsored,
  } = useCheckTransferSponsorship();
  const sponsorshipCheckDisabled = loadingSponsorship || isSponsored !== null;

  const { blockchain } = useBlockchainContext();
  const tokens = blockchain.erc20_tokens;
  const tokenAddresses = tokens.reduce<{ [key: string]: `0x${string}` }>(
    (acc, token) => {
      acc[token.symbol] = token.address as `0x${string}`;
      return acc;
    },
    {}
  );

  const [isGasFeeCardExpanded, setIsGasFeeCardExpanded] = useState(false);

  useEffect(() => {
    if (txHash) {
      setError(false);
      router.push({
        pathname: `transaction`,
        params: { txHash: txHash },
      });
    }

    // if (currencyScanned) {
    //   setCurrency(currencyScanned);
    // }

    // if (amountScanned) {
    //   handleAmountChange(amountScanned);
    // }
  }, [txHash, currencyScanned, addressScanned, amountScanned]);

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      {/* Centered Card */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <Card style={{ width: '100%' }}>
          <Card.Content>
            {/* Summary */}
            <Text style={[styles.summaryText]}>
              Summary
            </Text>

            {/* To Address */}
            <View style={{ marginVertical: 8 }}>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold" }}>To Address:</Text>
              </Text>
              <Text style={styles.infoText}>
                {toAddress}  {/* Address on a new line */}
              </Text>
            </View>

            {/* Amount */}
            <View style={{ marginVertical: 8 }}>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold" }}>Amount:</Text>
              </Text>
              <Text style={styles.infoText}>
                {amount} {currency} {/* Amount and currency on a new line */}
              </Text>
            </View>
            
          </Card.Content>
        </Card>


      </View>

      {/* Transfer Button at the Bottom */}
      <View style={{ paddingBottom: 20, alignItems: 'center' }}>
        <Button
          mode="contained"
          style={[styles.button, { width: 200 }]}
          onPress={
            currency === eth_symbol
              ? () => transferToAddress(toAddress, amount)
              : () =>
                  transferTokenToAddress(
                    tokenAddresses[currency],
                    toAddress,
                    amount
                  )
          }
          disabled={loading || !isAmountValid}
        >
          {currency === eth_symbol ? `Transfer ETH! ${loading ? "Sending..." : ""}` : "Transfer!"}
        </Button>
      </View>
    </View>
  );
}

export default SubmitTransferScreen;
