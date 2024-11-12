import {
  View,
  ScrollView,
  Image,
  RefreshControl,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Card, Text, Button, Switch } from "react-native-paper";
import { useTokenInfo } from "../../../hooks/useTokenInfo";
import styles from "../../../styles/styles";
import { theme } from "../../../styles/color";
import { router } from "expo-router";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import UballetSpinner from "../../../components/UballetSpinner/UballetSpinner";

const BalanceScreen = () => {
  const defaultLogoUrl = "https://cryptologos.cc/logos/ethereum-eth-logo.png";

  // Get the hooks
  const [showZeroBalance, setShowZeroBalance] = useState(true);
  const { data, totalSumData, loading, error, refetch } = useTokenInfo();

  const toggleShowZeroBalance = () => {
    setShowZeroBalance((prev) => !prev);
  };

  const refresh = () => {
    refetch();
  };

  if (error) {
    console.log(error)
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }
      >
        <View style={{ ...styles.container, alignItems: "stretch" }}>
          <Text>No data available :(</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }
      >
        <View className="p-4 mt-5">
          <Card
            className="mb-4"
            onPress={() => {
              router.push("/(auth)/portfolio");
            }}
          >
            <Card.Title titleVariant="titleMedium" title="Total balance" />
            <Card.Content>
              {loading ? (
                <View className="flex justify-center items-center m-5">
                  <UballetSpinner />
                </View>
              ) : (
                <View className="flex flex-row justify-start w-50 items-center mt-2">
                  <Text className="text-3xl font-bold">
                    {totalSumData ? totalSumData.toFixed(2) : "0.00"}
                  </Text>
                  <Text className="mt-2"> USD</Text>
                  <View className="-mb-2 ml-1">
                    <AntDesign
                      name="doubleright"
                      size={20}
                      color="black"
                      className=""
                    />
                  </View>
                </View>
              )}
            </Card.Content>
          </Card>

          <Button
            style={{ ...styles.button, backgroundColor: theme.colors.primary }}
            textColor="white"
            className="-mt-0.5"
            onPress={() => {
              router.push("/(auth)/deposit");
            }}
          >
            <Text className="text-white text-center font-bold">
              Deposit Tokens
            </Text>
          </Button>

          <Button
            testID="import-tokens-button"
            style={{ ...styles.button, backgroundColor: theme.colors.primary }}
            textColor="white"
            className="-mt-0.5"
            onPress={() => {
              router.push("/(auth)/import");
            }}
          >
            <Text className="text-white text-center font-bold">
              Import Tokens
            </Text>
          </Button>

          {/* Checkbox to toggle zero balance tokens */}
          <View className="flex flex-row justify-left mb-1">
            <Text>Hide tokens with zero balance</Text>
            <Switch
              className="-mt-0.5 w-12"
              value={showZeroBalance}
              onValueChange={toggleShowZeroBalance}
            />
          </View>

          <Card>
            <Card.Title titleVariant="titleMedium" title="Balance by token" />
            <Card.Content>
              {loading ? (
                <View className="flex justify-center items-center m-5">
                  <UballetSpinner />
                </View>
              ) : (
                <View className="flex flex-col justify-between mt-2 items-center text-center">
                  {Object.entries(data ?? {})
                    .filter(
                      ([key, { balance }]) =>
                        key == "ETH" || !showZeroBalance || balance > 0
                    )
                    .map(([symbol, amount]) => (
                      <View
                        key={symbol}
                        testID={"token-balance-" + symbol}
                        className="flex flex-row w-full justify-between"
                      >
                        <View className="flex flex-row text-center items-center">
                          {data?.[symbol] ? (
                            <Image
                              source={{
                                uri: data[symbol]["logoUrl"] ?? defaultLogoUrl,
                              }}
                              className="w-6 h-6"
                            />
                          ) : (
                            <View>
                              <Image
                                source={{
                                  uri: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
                                }}
                                className="w-6 h-6"
                              />
                            </View>
                          )}

                          <View className="flex flex-col ml-2 w-20 justify-start">
                            <Pressable
                              onPress={() => {
                                router.push({
                                  pathname: "/(auth)/market-info",
                                  params: {
                                    symbol: symbol,
                                    name: data?.[symbol]?.["name"],
                                  },
                                });
                              }}
                            >
                              <Text className="font-bold text-xl text-[#277ca5] ">
                                {symbol}
                              </Text>
                              <Text className="text-gray-500">
                                {data?.[symbol]?.name?.toString() ?? ""}
                              </Text>
                            </Pressable>
                          </View>
                        </View>

                        <View className="flex flex-col justify-center items-end text-center flex-1 ml-12">
                          <Text
                            testID={"token-balance-" + symbol + "-amount"}
                            className="text-center text-2xl font-bold flex-shrink"
                            adjustsFontSizeToFit
                            numberOfLines={1}
                          >
                            {data?.[symbol]?.balance?.toString() ?? "-"}
                          </Text>
                          <Text>
                            {data?.[symbol].balanceInUSDT === undefined
                              ? "0"
                              : data[symbol].balanceInUSDT.toFixed(2)}{" "}
                            USD
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
    </SafeAreaView>
  );
};

export default BalanceScreen;
