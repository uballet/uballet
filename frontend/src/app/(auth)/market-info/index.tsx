import {
  SafeAreaView,
  ScrollView,
  View,
  Linking,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Card, Text } from "react-native-paper";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useTokenInfoMarket } from "../../../hooks/useTokenInfoMarket";
import UballetSpinner from "../../../components/UballetSpinner/UballetSpinner";

function MarketInfoScreen() {
  const { symbol, name } = useLocalSearchParams<{
    symbol: string;
    name: string;
  }>();

  const { data, loading, refetch } = useTokenInfoMarket();

  const circulatingSupply = data?.[symbol]?.circulatingSupply;
  const maxSupply = data?.[symbol]?.maxSupply;
  const currentPrice = data?.[symbol]?.quote;
  const marketCap = data?.[symbol]?.marketCap;
  const volume24h = data?.[symbol]?.volume24h;
  const percentChange24h = data?.[symbol]?.percentChange24h;
  const marketCapDominance = data?.[symbol]?.marketCapDominance;
  const isPriceUp = (percentChange24h ?? 0) >= 0;
  const tokenCMCUrl = data?.[symbol]?.cmcUrl;
  const tokenLogoUrl = data?.[symbol]?.logoUrl?.replace("64x64", "128x128");

  console.log("CMC URL is:", tokenCMCUrl);

  // Open browser with the link
  const openLink = () => {
    if (tokenCMCUrl) {
      Linking.openURL(tokenCMCUrl).catch((err) =>
        console.error("An error occurred", err)
      );
      console.log("Opening link:", tokenCMCUrl);
    } else {
      console.warn("Token CMC URL is undefined");
    }
    console.log("Opening link:", tokenCMCUrl);
  };

  const refresh = () => {
    refetch();
  };

  if (
    !loading &&
    (!data || data[symbol] === undefined || data[symbol] === null)
  ) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 w-full">
        <ScrollView
          className="flex-grow p-4"
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refresh} />
          }
        >
          <View className="flex-1 justify-center items-center mt-4">
            <Text className="text-2xl font-bold">No data available</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 w-full">
        <ScrollView className="flex-grow p-4">
          <View className="flex-1 justify-center items-center mt-4">
            <UballetSpinner />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 w-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }
        className="flex-grow p-4"
      >
        <View className="w-full max-w-md mx-auto">
          <Card className="elevation-3 rounded-lg">
            <Card.Cover
              source={{
                uri: tokenLogoUrl,
              }}
              className="h-30"
            />
            <Card.Content>
              <View className="flex-row justify-between">
                <Text
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  className="text-2xl font-bold mb-4 mt-3 "
                >
                  {symbol} | {name}
                </Text>

                {tokenCMCUrl ? (
                  <TouchableOpacity
                    onPress={() => openLink()}
                    className="mb-4 mt-3"
                  >
                    <FontAwesome5
                      name="external-link-alt"
                      size={30}
                      color="gray"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View className="mb-4">
                <Text className="text-xl font-semibold">Current Price</Text>
                <View className="flex flex-row justify-start items-center">
                  <Text className="text-2xl font-bold">
                    ${currentPrice ? currentPrice.toLocaleString() : "N/A"}
                  </Text>

                  <View className="flex-row">
                    <View className="mt-0.5 ml-1">
                      <Entypo
                        name={isPriceUp ? "triangle-up" : "triangle-down"}
                        size={18}
                        color={isPriceUp ? "green" : "red"}
                      />
                    </View>

                    <Text
                      className={`text-sm mt-0.5 font-bold ${
                        isPriceUp ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {percentChange24h?.toFixed(2)}% (24h)
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-xl font-semibold">Market Cap</Text>
                <Text className="text-2xl font-bold">
                  ${marketCap?.toLocaleString() || "N/A"}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-xl font-semibold">Market Dominance</Text>
                <Text className="text-2xl font-bold">
                  {marketCapDominance?.toFixed(1)?.toLocaleString() + "%" ||
                    "N/A"}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-xl font-semibold">24h Volume</Text>
                <Text className="text-2xl font-bold">
                  ${volume24h?.toLocaleString() || "N/A"}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-xl font-semibold">Max Supply</Text>
                <Text className="text-2xl font-bold">
                  {maxSupply?.toLocaleString() || "N/A"}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-xl font-semibold">
                  Circulating Supply
                </Text>
                <Text className="text-2xl font-bold">
                  {circulatingSupply
                    ? circulatingSupply.toLocaleString()
                    : "N/A"}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MarketInfoScreen;
