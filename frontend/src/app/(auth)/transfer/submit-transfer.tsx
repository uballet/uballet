import { useEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { useSafeLightAccount } from "../../../hooks/useLightAccount";
import { useTransfer } from "../../../hooks/useTransfer";
import { useCheckTransferSponsorship } from "../../../hooks/useCheckTransferSponsorship";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import { Text, Button, TextInput, Card } from "react-native-paper";
import styles from "../../../styles/styles";
import { useLocalSearchParams } from "expo-router";
import { useAlchemyClient } from "../../../hooks/useAlchemyClient";
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
    <ScrollView>
      <View style={styles.containerTransfer}>
        <Card >
          <Card.Content>
            {/* Transfer Button */}
            <Button
              mode="contained"
              style={{
                ...styles.button,
                backgroundColor: loading ? "#CCCCCC" : "black",
              }}
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
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

export default SubmitTransferScreen;
