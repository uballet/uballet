import { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import styles from "../../../styles/styles";
import TransferInput from "../../../components/TransferInput/TransferInput";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import { theme } from "../../../styles/color";
import { useBalance } from "../../../hooks/useBalance";
import { useTokenBalance } from "../../../hooks/useTokenBalance";
import UballetSpinner from "../../../components/UballetSpinner/UballetSpinner";
import { Separator } from "../../../components/Separator/Separator";

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
  const {
    tokenBalances,
    loading: tokenBalancesLoading,
    error,
  } = useTokenBalance();

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
      setIsAmountValid(
        parseFloat(amountWithoutComma) > 0 &&
          (currentBalance === null ||
            parseFloat(amountWithoutComma) <= parseFloat(currentBalance))
      );
    }
  };

  const handleNext = () => {
    router.push({
      pathname: "transfer/gas-info",
      params: { toAddress, amount, currency },
    });
  };

  if (ethBalanceLoading || tokenBalancesLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 100,
          }}
        >
          <UballetSpinner />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ width: "100%", paddingHorizontal: 20 }}>
          {ethBalanceLoading || tokenBalancesLoading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 100,
              }}
            >
              <UballetSpinner />
            </View>
          ) : (
            <>
              <Card style={{ marginTop: 16 }}>
                <Card.Content>
                  <Text style={styles.infoText}>
                    Sending tokens to the following address
                  </Text>
                  <Text style={{ ...styles.infoText, color: "gray" }}>
                    {toAddress}
                  </Text>
                  <Separator />
                  <Text style={styles.infoText}>
                    Enter the amount and currency
                  </Text>

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
                  <Text style={styles.infoText}>
                    Balance available:{" "}
                    {currentBalance ? `${currentBalance} ${currency}` : "N/A"}
                  </Text>
                  {error && (
                    <Text className="text-red-500 mt-2">
                      Error loading token balances{" "}
                    </Text>
                  )}

                  <Text style={{ ...styles.infoText, color: "gray" }}>
                    In the next screen, you will be able to check the gas price
                    and confirm the transaction
                  </Text>
                </Card.Content>
              </Card>
            </>
          )}
        </View>
      </View>

      {/* Next Button */}
      <View
        style={{
          paddingBottom: 4,
          alignItems: "center",
          marginHorizontal: 16,
        }}
      >
        <Button
          testID="transfer-amount-next-button"
          mode="contained"
          style={styles.button}
          onPress={handleNext}
          disabled={
            !isAmountValid ||
            !amount ||
            ethBalanceLoading ||
            tokenBalancesLoading
          }
        >
          <Text className="text-white text-center font-bold"> Next </Text>
        </Button>
      </View>
    </ScrollView>
  );
}

export default AmountAndCurrencyScreen;
