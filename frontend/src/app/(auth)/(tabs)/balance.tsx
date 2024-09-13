import {
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { Card, Text, Button, Switch } from "react-native-paper";
import { useBalanceInUSDT } from "../../../hooks/useBalanceInUSDT";
import styles from "../../../styles/styles";
import arrowPNG from "../../../../assets/arrow.png";
import images from "../../../../assets/imageMap";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import config from "../../../../netconfig/blockchain.default.json";

const BalanceScreen = () => {
  const tokens = config.sepolia.erc20_tokens;

  let tokensNames: { [key: string]: string } = {};
  tokensNames["ETH"] = "Ethereum";
  for (const token of tokens) {
    tokensNames[token.symbol] = token.name;
  }

  const tokenPNGs = images;

  const [totalSum, setTotalSum] = useState(0);
  const [showZeroBalance, setShowZeroBalance] = useState(true);
  const { data, loading, error, refetch } = useBalanceInUSDT();

  useEffect(() => {
    if (loading) {
      return;
    }
    let totalTokensBalance = 0;
    for (const token in data) {
      const sum = data?.[token]?.quote || 0;
      totalTokensBalance += sum;
    }
    setTotalSum(totalTokensBalance);
  }, [loading]);

  // Function to toggle the visibility of zero balance tokens
  const toggleShowZeroBalance = () => {
    setShowZeroBalance((prev) => !prev);
  };

  if (error) {
    return (
      <View style={{ ...styles.container, alignItems: "stretch" }}>
        <Text>No data available :(</Text>
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
    >
      <View style={{ ...styles.container, alignItems: "stretch" }}>
        <Text style={styles.screenHeader}>Balance</Text>

        <Card
          className="mb-4"
          onPress={() => {
            router.push("/(auth)/portfolio");
          }}
        >
          <Card.Content>
            <Text>Total Balance</Text>
            {loading ? (
              <View className="flex justify-center items-center m-5">
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : (
              <View className="flex flex-row justify-start w-50 items-center mt-2">
                <Text className="text-3xl font-bold">
                  {totalSum.toFixed(2)}
                </Text>
                <Text className="mt-2"> USDT</Text>
                <Image source={arrowPNG} className="w-3 h-2 mt-2 ml-1" />
                <Image source={arrowPNG} className="w-3 h-2 mt-2 -ml-1" />
              </View>
            )}
          </Card.Content>
        </Card>

        <Button
          style={{ ...styles.button, backgroundColor: "black" }}
          textColor="white"
          className="-mt-0.5"
          onPress={() => {
            router.push("/(auth)/deposit");
          }}
        >
          <Text className="text-white text-center font-medium">
            Deposit Tokens
          </Text>
        </Button>

        {/* Checkbox to toggle zero balance tokens */}
        <View className="flex flex-row  justify-left mb-1">
          <Text>Hide tokens with zero balance</Text>
          <Switch
            className="-mt-0.5 w-12"
            value={showZeroBalance}
            onValueChange={toggleShowZeroBalance}
          />
        </View>

        <Card>
          <Card.Content>
            <Text>Balance by Token</Text>

            {loading ? (
              <View className="flex justify-center items-center m-5">
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : (
              <View className="flex flex-col justify-between mt-2 items-center text-center w-[400px]">
                {Object.entries(data ?? {})
                  .filter(([_, { balance }]) => !showZeroBalance || balance > 0)
                  .map(([symbol, amount]) => (
                    <View key={symbol} className="flex flex-row mr-5">
                      <View className="flex flex-row w-[200px] text-center items-center">
                        <Image source={tokenPNGs[symbol]} className="w-6 h-6" />
                        <View className="flex flex-col ml-2 w-20 justify-start">
                          <Text className="font-bold text-xl text-[#277ca5] ">
                            {symbol}
                          </Text>
                          <Text className="text-gray-500">
                            {tokensNames[symbol]}
                          </Text>
                        </View>
                      </View>

                      <View className="flex flex-col justify-center items-end  w-[170px] ml-2 text-center">
                        <Text className="text-center text-2xl font-bold">
                          {data?.[symbol].balance.toString() ?? "-"}
                        </Text>
                        <Text>
                          {data?.[symbol] === undefined
                            ? "-"
                            : data[symbol].quote.toFixed(2)}{" "}
                          USDT
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default BalanceScreen;
