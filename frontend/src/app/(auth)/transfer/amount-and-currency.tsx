import { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Button, Card } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import styles from "../../../styles/styles";
import TransferInput from "../../../components/TransferInput/TransferInput";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";

function AmountAndCurrencyScreen() {
  const { toAddress } = useLocalSearchParams<{ toAddress: `0x${string}` }>(); // Receiving the address from the previous screen
  const eth_symbol = "ETH";

  const { blockchain } = useBlockchainContext();
  const tokens = blockchain.erc20_tokens;
  const currencies = [eth_symbol, ...tokens.map((token) => token.symbol)];
  
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(eth_symbol);
  const [isAmountValid, setIsAmountValid] = useState(true);

  const handleAmountChange = (amount: string) => {
    const validAmount = amount.match(/^\d*\.?\d{0,18}$/);
    if (validAmount) {
      setAmount(amount);
      setIsAmountValid(parseFloat(amount) > 0);
    }
  };

  const handleNext = () => {
    router.push({
      pathname: "transfer/transfer_old",
      params: { toAddress, amount, currency },
    });
  };

  return (
    <ScrollView>
      <View style={styles.containerTransfer}>
        <Card>
          <Card.Content>

            {/* Transfer Input (Amount and Currency Selection) */}
            <Card.Title title="Transfer Amount:" />
            <TransferInput
              amount={amount}
              currency={currency}
              currencies={currencies}
              isAmountValid={isAmountValid}
              handleAmountChange={handleAmountChange}
              setCurrency={setCurrency}
            />

            {/* Next Button */}
            <Button
              mode="contained"
              style={[styles.button, { width: 200 }]}
              onPress={handleNext}
              disabled={!isAmountValid || !amount}
            >
              Next
            </Button>

          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

export default AmountAndCurrencyScreen;
