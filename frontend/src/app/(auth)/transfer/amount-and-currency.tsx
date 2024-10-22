import { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import styles from "../../../styles/styles";
import TransferInput from "../../../components/TransferInput/TransferInput";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import { theme } from "../../../styles/color"
import { useBalance } from "../../../hooks/useBalance";
import { useTokenBalance } from "../../../hooks/useTokenBalance";
import { ActivityIndicator } from "react-native";

function AmountAndCurrencyScreen() {
  const { toAddress } = useLocalSearchParams<{ toAddress: `0x${string}` }>(); // Receiving the address from the previous screen
  const eth_symbol = "ETH";

  const { blockchain } = useBlockchainContext();
  const tokens = blockchain.erc20_tokens;
  const currencies = [eth_symbol, ...tokens.map((token) => token.symbol)];
  
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(eth_symbol);
  const [isAmountValid, setIsAmountValid] = useState(true);

  const { data: ethBalance, isLoading: ethBalanceLoading } = useBalance();
  const { tokenBalances, loading: tokenBalancesLoading } = useTokenBalance();

  const [currentBalance, setCurrentBalance] = useState<string | null>(null);

  useEffect(() => {
    if (currency === eth_symbol && ethBalance) {
      setCurrentBalance(ethBalance);
    } else if (tokenBalances[currency]) {
      setCurrentBalance(tokenBalances[currency]);
    } else {
      setCurrentBalance(null);
    }
  }, [currency, ethBalance, tokenBalances]);

  const handleAmountChange = (amount: string) => {
    const amountWithoutComma = amount.replace(",", ".");
    const validAmount = amountWithoutComma.match(/^\d*\.?\d{0,18}$/);
    if (validAmount) {
      setAmount(amountWithoutComma);
      setIsAmountValid(parseFloat(amountWithoutComma) > 0 && 
        (currentBalance === null || parseFloat(amountWithoutComma) <= parseFloat(currentBalance)));
    }
  };

  const handleNext = () => {
    router.push({
      pathname: "transfer/gas-info",
      params: { toAddress, amount, currency },
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'space-between', backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '100%', paddingHorizontal: 20 }}>
          <Text style={styles.infoText}>Enter the amount and currency</Text>

          <TransferInput
            testID="transfer-amount-input"
            amount={amount}
            currency={currency}
            currencies={currencies}
            isAmountValid={isAmountValid}
            handleAmountChange={handleAmountChange}
            setCurrency={setCurrency}
            currentBalance={currentBalance}
          />
        </View>

        {/* Balance Indicator */}
        {(ethBalanceLoading || tokenBalancesLoading) ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Text style={styles.infoText}>
              Balance: {currentBalance ? `${currentBalance} ${currency}` : 'N/A'}
          </Text>
        )}
      </View>

      

      {/* Next Button */}
      <View style={{ paddingBottom: 20, alignItems: 'center' }}>
        <Button
          testID="transfer-amount-next-button"
          mode="contained"
          style={[styles.button, { width: 200 }]}
          onPress={handleNext}
          disabled={!isAmountValid || !amount}
        >
          Next
        </Button>
      </View>
    </ScrollView>
  );
}

export default AmountAndCurrencyScreen;
