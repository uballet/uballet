import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTransfer } from "../../../hooks/useTransfer";
import { useCheckTransferSponsorship } from "../../../hooks/useCheckTransferSponsorship";

import { Text, Button, TextInput, Card } from "react-native-paper";
import styles from "../../../styles/styles";
import EstimateGasFees from "../../../components/EstimateGasFees";
import { Link, useLocalSearchParams } from "expo-router";
import { ethers } from "ethers";
import { router } from "expo-router";
import { useAccountContext } from "../../../hooks/useAccountContext";
import config from "../../../../netconfig/blockchain.default.json";

type Token = {
  name: string;
  symbol: string;
  address: string;
};

type TokensData = {
  tokens: Token[];
};

function TransferScreen() {
  const { account } = useAccountContext()

  const currencyScanned = useLocalSearchParams<{ currency: string }>()?.currency;
  const addressScanned = useLocalSearchParams<{ address: string }>()?.address;
  const amountScanned = useLocalSearchParams<{ amount: string }>()?.amount;
  const { address } = useLocalSearchParams<{ address: string }>();
  const [toAddress, setAddress] = useState(
    address?.startsWith("0x") ? address.slice(2) : ""
  );
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [isAddressValid, setIsAddressValid] = useState(true);
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

  const tokens = config.sepolia.erc20_tokens;;
  const currencies = ["ETH", ...tokens.map((token) => token.symbol)];
  const tokenAddresses = tokens.reduce<{ [key: string]: `0x${string}` }>(
    (acc, token) => {
      acc[token.symbol] = token.address as `0x${string}`;
      return acc;
    },
    {}
  );

  useEffect(() => {
    setIsSponsored(null);
  }, [toAddress]);

  useEffect(() => {
    if (txHash) {
      setError(false);
      setAddress("");
      setAmount("");
      setCurrency("ETH");
      router.push({
        pathname: `transaction`,
        params: { txHash: txHash },
      });
    }

    if (currencyScanned) {
      setCurrency(currencyScanned);
    }

    if (addressScanned) {
      handleAddressChange(addressScanned.slice(2));
    }
    if (amountScanned) {
      handleAmountChange(amountScanned);
    }
  }, [txHash, currencyScanned, addressScanned, amountScanned]);

  const handleAddressChange = (address: string) => {
    const fullAddress = `0x${address}`;
    setAddress(address);
    setIsAddressValid(ethers.isAddress(fullAddress));
  };

  const handleAmountChange = (amount: string) => {
    // Allow only numbers and a single dot with up to 18 decimal places
    const validAmount = amount.match(/^\d*\.?\d{0,18}$/);
    if (validAmount) {
      setAmount(amount);
      setIsAmountValid(parseFloat(amount) > 0);
    }
  };

  return (
    <ScrollView >
      <View style={styles.container}>
      <Card>
        <Card.Content>
          <Card.Title title="Transfer Amount:" />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextInput
              mode="outlined"
              placeholder="0.0000"
              value={amount}
              onChangeText={handleAmountChange}
              style={{ margin: 8, flex: 1 }}
              keyboardType="numeric"
              error={!isAmountValid}
            />
            <Picker
              selectedValue={currency}
              
              style={{ width: 150 }}
              onValueChange={(itemValue: string) => setCurrency(itemValue)}
            >
              {currencies.map((curr, index) => (
                <Picker.Item key={index} label={curr} value={curr} />
              ))}
            </Picker>
          </View>
         
          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => router.push({ pathname: "scanner" })}
          >
            Scan QR
          </Button>
          {!isAmountValid && (
            <Text style={{ color: "red", marginLeft: 8 }}>
              Amount must be greater than 0
            </Text>
          )}
          <Text variant="bodySmall" selectable={true} style={{ margin: 8 }}>
            {`From:\n${account?.getAddress()}`}
          </Text>
          <EstimateGasFees
            target={`0x${toAddress}`}
            data={"0x"}
          />
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
            left={<TextInput.Affix text="0x" />}
            onChangeText={handleAddressChange}
            error={!isAddressValid}
          />
          {!isAddressValid && (
            <Text style={{ color: "red", marginLeft: 8 }}>
              Invalid Ethereum address
            </Text>
          )}
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
            disabled={
              sponsorshipCheckDisabled || !isAddressValid || !isAmountValid
            }
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
                loading ||
                !toAddress ||
                !amount ||
                !isAddressValid ||
                !isAmountValid
                  ? "#CCCCCC"
                  : "black",
            }}
            onPress={() => transferToAddress(`0x${toAddress}`, amount)}
            disabled={loading || !isAddressValid || !isAmountValid}
          >
            Transfer ETH! {loading ? "Sending..." : ""}
          </Button>
        </>
      ) : (
        <Button
          mode="contained"
          style={{
            ...styles.button,
            backgroundColor:
              loading ||
              !toAddress ||
              !amount ||
              !isAddressValid ||
              !isAmountValid
                ? "#CCCCCC"
                : "black",
          }}
          onPress={() =>
            transferTokenToAddress(
              tokenAddresses[currency],
              `0x${toAddress}`,
              amount
            )
          }
          disabled={loading || !isAddressValid || !isAmountValid}
        >
          Transfer!
        </Button>
      )}
      </View>
    </ScrollView>
  );
}

export default TransferScreen;
