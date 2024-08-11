import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSafeLightAccount } from "../../../hooks/useLightAccount";
import { useTransfer } from "../../../hooks/useTransfer";
import { useCheckTransferSponsorship } from "../../../hooks/useCheckTransferSponsorship";
import tokensData from "../../../../erc20sepolia.json";
import {
  Text,
  Button,
  TextInput,
  Card,
} from "react-native-paper";
import styles from "../../../styles/styles";
import EstimateGasFees from "../../../components/EstimateGasFees";
import { Link, useLocalSearchParams } from "expo-router";

type Token = {
  name: string;
  symbol: string;
  address: string;
};

type TokensData = {
  tokens: Token[];
};

function TransferScreen() {
  const account = useSafeLightAccount();
  const { address } = useLocalSearchParams<{ address: string }>()
  const [toAddress, setAddress] = useState(address?.startsWith("0x") ? address.slice(2) : "");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const { transferToAddress, transferTokenToAddress, loading, error, txHash } =
    useTransfer();
  const {
    checkTransferSponsorship,
    loading: loadingSponsorship,
    setIsSponsored,
    isSponsored,
  } = useCheckTransferSponsorship();
  const sponsorshipCheckDisabled = loadingSponsorship || isSponsored !== null;

  const tokens: TokensData = tokensData;
  const currencies = ["ETH", ...tokens.tokens.map((token) => token.symbol)];
  const tokenAddresses = tokens.tokens.reduce<{ [key: string]: `0x${string}` }>(
    (acc, token) => {
      acc[token.symbol] = token.address as `0x${string}`;
      return acc;
    },
    {}
  );

  useEffect(() => {
    setIsSponsored(null);
  }, [toAddress]);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Card>
        <Card.Content>
          <Text variant="titleMedium">Transfer Amount: </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextInput
                mode="outlined"
              placeholder="0.00001"
              value={amount}
              onChangeText={setAmount}
              style={{ margin: 8, flex: 1 }}
              keyboardType="numeric"
            />
            <Picker
              selectedValue={currency}
              style={{width: 150 }}
              onValueChange={(itemValue: string) => setCurrency(itemValue)}
            >
              {currencies.map((curr, index) => (
                <Picker.Item key={index} label={curr} value={curr} />
              ))}
            </Picker>
          </View>
          <EstimateGasFees apiUrl="placeholder, hardcode params for now" />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text variant="titleMedium" style={{ margin: 8 }}>
              To Address:{" "}
            </Text>
            <Link href="/(auth)/contacts" push>
              <Text variant="bodyMedium" style={{ margin: 8 }}>
                Select Contact
              </Text>
            </Link>
          </View>
          <TextInput
            mode="outlined"
            style={{ margin: 8 }}
            placeholder="Address without 0x prefix"
            value={toAddress}
            left={<TextInput.Affix text="0x"/>}
            onChangeText={setAddress}
          />
        </Card.Content>
      </Card>
      {currency === "ETH" ? (
        <>
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
            disabled={sponsorshipCheckDisabled}
            onPress={() => checkTransferSponsorship(`0x${toAddress}`, amount)}
            textColor="white"
          >
            {isSponsored
              ? "We'll pay for gas!"
              : isSponsored === null
              ? "Check sponsorship"
              : "You'll pay for gas"}
          </Button>
          <Button
            mode="contained"
            style={{
              ...styles.button,
              backgroundColor:
                loading || !toAddress || !amount ? "#CCCCCC" : "black",
            }}
            onPress={() => transferToAddress(`0x${toAddress}`, amount)}
            disabled={loading}
          >Transfer ETH!</Button>
        </>
      ) : (
        <Button
          mode="contained"
          style={{
            ...styles.button,

            backgroundColor:
              loading || !toAddress || !amount ? "#CCCCCC" : "black",
          }}
          onPress={() =>
            transferTokenToAddress(
              tokenAddresses[currency],
              `0x${toAddress}`,
              amount
            )
          }
          disabled={loading}
        >
          Transfer!
        </Button>
      )}
      {txHash && <Text selectable>{txHash}</Text>}
      {error && <Text style={{ color: "red" }}>Something went wrong!</Text>}
    </ScrollView>
  );
}

export default TransferScreen;
