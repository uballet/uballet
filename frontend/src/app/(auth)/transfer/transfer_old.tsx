import { useEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { useSafeLightAccount } from "../../../hooks/useLightAccount";
import { useTransfer } from "../../../hooks/useTransfer";
import { useCheckTransferSponsorship } from "../../../hooks/useCheckTransferSponsorship";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import { Text, Button, TextInput, Card } from "react-native-paper";
import styles from "../../../styles/styles";
import EstimateGasFees from "../../../components/EstimateGasFees/EstimateGasFees";
import { useLocalSearchParams } from "expo-router";
import { useAlchemyClient } from "../../../hooks/useAlchemyClient";
import { router } from "expo-router";
import TransferInput from "../../../components/TransferInput/TransferInput";

function TransferScreen() {
  const { toAddress } = useLocalSearchParams<{ toAddress: `0x${string}` }>();
  console.log(toAddress);


  const eth_symbol = "ETH";

  const account = useSafeLightAccount();
  const currencyScanned = useLocalSearchParams<{ currency: string }>()?.currency;
  const addressScanned = useLocalSearchParams<{ address: string }>()?.address;
  const amountScanned = useLocalSearchParams<{ amount: string }>()?.amount;
  const client = useAlchemyClient();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(eth_symbol);
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
    checkTransferSponsorship,
    loading: loadingSponsorship,
    setIsSponsored,
    isSponsored,
  } = useCheckTransferSponsorship();
  const sponsorshipCheckDisabled = loadingSponsorship || isSponsored !== null;

  const { blockchain } = useBlockchainContext();
  const tokens = blockchain.erc20_tokens;
  const currencies = [eth_symbol, ...tokens.map((token) => token.symbol)];
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
      setAmount("");
      setCurrency(eth_symbol);
      router.push({
        pathname: `transaction`,
        params: { txHash: txHash },
      });
    }

    if (currencyScanned) {
      setCurrency(currencyScanned);
    }

    if (amountScanned) {
      handleAmountChange(amountScanned);
    }
  }, [txHash, currencyScanned, addressScanned, amountScanned]);

  const handleAmountChange = (amount: string) => {
    const validAmount = amount.match(/^\d*\.?\d{0,18}$/);
    if (validAmount) {
      setAmount(amount);
      setIsAmountValid(parseFloat(amount) > 0);
    }
  };

  return (
    <ScrollView>
      <View style={styles.containerTransfer}>
        <Card >
          <Card.Content>

            {/* Transfer Input */}
            <Card.Title title="Transfer Amount:" />
            <TransferInput
              amount={amount}
              currency={currency}
              currencies={currencies}
              isAmountValid={isAmountValid}
              handleAmountChange={handleAmountChange}
              setCurrency={setCurrency}
            />

            {/* Estimate Gas Fees */}
            <TouchableOpacity
              onPress={() => setIsGasFeeCardExpanded(!isGasFeeCardExpanded)}
            >
              <View style={{ margin: 8, backgroundColor: "#f5f5f5", padding: 16 }}>
                <Text style={{ fontWeight: "bold" }}>Estimate Gas Fees</Text>
              </View>
            </TouchableOpacity>
            {isGasFeeCardExpanded && (
              <Card style={{ margin: 8 }}>
                <EstimateGasFees
                  client={client}
                  account={account}
                  target={toAddress}
                  data={"0x"}
                />
              </Card>
            )}

            {/* Paymaster check */}
            {currency === eth_symbol && (
              <Button
                style={{
                  ...styles.button,
                  backgroundColor: !sponsorshipCheckDisabled
                    ? "black"
                    : loadingSponsorship
                    ? "#CCCCCC"
                    : isSponsored
                    ? "green"
                    : "red",
                }}
                loading={loadingSponsorship}
                disabled={sponsorshipCheckDisabled || !isAmountValid}
                onPress={() => checkTransferSponsorship(toAddress, amount)}
                textColor="white"
              >
                {isSponsored
                  ? "We'll pay for gas!"
                  : isSponsored === null
                  ? "Check sponsorship"
                  : "You'll pay for gas"}
              </Button>
            )}

            {/* Transfer Button */}
            <Button
              mode="contained"
              style={{
                ...styles.button,
                backgroundColor:
                  loading ||
                  !amount ||
                  !isAmountValid
                    ? "#CCCCCC"
                    : "black",
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

export default TransferScreen;
