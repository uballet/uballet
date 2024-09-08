import {
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { Card, Text } from "react-native-paper";
import { useBalance } from "../../../hooks/useBalance";
import { useTokenBalance } from "../../../hooks/useTokenBalance";
import { useBalanceInUSDT } from "../../../hooks/useBalanceInUSDT";
import styles from "../../../styles/styles";
import ETHLogo from "../../../../assets/eth.png";
import USDTLogo from "../../../../assets/usdt.png";
import DAILogo from "../../../../assets/dai.png";
import USDCLogo from "../../../../assets/usdc.png";
import arrowPNG from "../../../../assets/arrow.png";
import { router } from "expo-router";
import { useState, useCallback } from "react";

const BalanceScreen = () => {
  let tokenPNGs: { [key: string]: any } = {
    ETH: ETHLogo,
    USDT: USDTLogo,
    DAI: DAILogo,
    USDC: USDCLogo,
  };
  let tokensNames: { [key: string]: string } = {
    ETH: "Ethereum",
    USDT: "Tether",
    DAI: "DAI",
    USDC: "USD Coin",
  };

  const { data, loading, error, refetch } = useBalanceInUSDT();
  const tokenBalancesInUSDT = data;
  const balance = useBalance() || "0";
  let tokenBalances = useTokenBalance();
  tokenBalances["ETH"] = balance;
  const totalTokensBalance = Object.values(data || {}).reduce(
    (a, b) => a + b,
    0
  );
  const totalSum = totalTokensBalance;

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, [refetch]);

  if (error) {
    return <Text>No data available</Text>;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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

        <Card>
          <Card.Content>
            <Text>Balance by Token</Text>
            {loading ? (
              <View className="flex justify-center items-center m-5">
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : (
              <View className="flex flex-col justify-between items-center text-center w-[400px]">
                {Object.entries(tokenBalancesInUSDT ?? {}).map(
                  ([symbol, amount]) => (
                    <View className="flex flex-row mr-5">
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
                          {tokenBalances[symbol].toString()}
                        </Text>
                        <Text>
                          {tokenBalancesInUSDT?.[symbol] === undefined
                            ? "-"
                            : tokenBalancesInUSDT[symbol].toFixed(2)}{" "}
                          USDT
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default BalanceScreen;
