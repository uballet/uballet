import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, Image } from "react-native";
import { Card, Text } from "react-native-paper";
import { useBalance } from "../../../hooks/useBalance";
import { useTokenBalance } from "../../../hooks/useTokenBalance";
import styles from "../../../styles/styles";
import PortfolioValueChart from "../../../components/PortfolioValueChart/PortfolioValueChart";
import UballetAPI from "../../../api/uballet";
import ETHLogo from "../../../../assets/eth.png";
import USDTLogo from "../../../../assets/usdt.png";
import DAILogo from "../../../../assets/dai.png";
import USDCLogo from "../../../../assets/usdc.png";
import arrowPNG from "../../../../assets/arrow2.png";
import { Link, router } from "expo-router";

const BalanceScreen: React.FC = () => {
  let balance = useBalance();
  let tokenBalances = useTokenBalance();
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

  // Hardcoded token balances for testing
  balance = "0.75";
  tokenBalances.DAI = "100";
  tokenBalances.USDT = "10.5";
  tokenBalances.USDC = "200";
  tokenBalances.ETH = balance;

  // Put ETH firt place in array
  const ethBalance = tokenBalances.ETH;
  delete tokenBalances.ETH;
  tokenBalances = { ETH: ethBalance, ...tokenBalances };

  // Parse all values in tokenBalances to float
  const tokenBalancesParsed = Object.fromEntries(
    Object.entries(tokenBalances).map(([key, value]) => [
      key,
      parseFloat(value),
    ])
  );
  tokenBalancesParsed["ETH"] = parseFloat(balance);

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [tokensBalancesInUSD, setTokensBalancesInUSD] = useState<{
    [key: string]: number;
  }>({});
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchData = async () => {
    let query = "ETH";
    for (const token in tokenBalancesParsed) {
      if (token === "ETH") continue;
      query += `,${token}`;
    }
    const response = await UballetAPI.getQuote({ coin: query });

    // Convert token balances in USD
    const tokenBalancesInUSD: { [key: string]: number } = {};
    for (const token in tokenBalancesParsed) {
      tokenBalancesInUSD[token] = response[token] * tokenBalancesParsed[token];
    }
    setTokensBalancesInUSD(tokenBalancesInUSD);

    // Sum all balance
    const totalTokensBalance = Object.values(tokenBalancesInUSD).reduce(
      (a, b) => a + b,
      0
    );
    setTotalBalance(totalTokensBalance);

    console.log("tokenBalancesInUSD:", tokenBalancesInUSD);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData();
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            router.push("/portfolio");
          }}
        >
          <Card.Content>
            <Text>Total Balance</Text>
            <View className="flex flex-row justify-start w-50 items-center mt-2">
              <Text className="text-3xl font-bold">
                {totalBalance.toFixed(2)}
              </Text>
              <Text className="mt-2"> USDT</Text>
              <Image source={arrowPNG} className="w-4 h-4 mt-2" />
            </View>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <Text>Balance by Token</Text>
            <View className="flex flex-col justify-between items-center text-center w-[400px]">
              {Object.entries(tokensBalancesInUSD).map(([symbol, amount]) => (
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
                      {tokenBalances[symbol]?.toString()}
                    </Text>
                    <Text>
                      {tokensBalancesInUSD[symbol] === undefined
                        ? "-"
                        : tokensBalancesInUSD[symbol].toFixed(2)}{" "}
                      USDT
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <PortfolioValueChart />
      </View>
    </ScrollView>
  );
};

export default BalanceScreen;
