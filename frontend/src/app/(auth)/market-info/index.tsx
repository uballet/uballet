import {
  SafeAreaView,
  ScrollView,
  View,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { Entypo, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

function MarketInfoScreen() {
  const cryptoName = "Bitcoin"; // Example cryptocurrency name
  const currentPrice = 26500.0; // Example current price in USD
  const marketCap = 500000000000; // Example market capitalization in USD
  const circulatingSupply = 19000000; // Example circulating supply
  const totalSupply = 21000000; // Example total supply
  const volume24h = 10000000000; // Example 24h trading volume in USD
  const previousPrice = 27000.0; // Example previous price in USD

  // Calculate price variation
  const priceVariation = currentPrice - previousPrice;
  const isPriceUp = priceVariation > 0;
  const priceVariationPercentage = (
    (priceVariation / previousPrice) *
    100
  ).toFixed(2);

  // Open browser with the link
  const openLink = () => {
    //const url = `https://coinmarketcap.com/currencies/${cryptoName.toLowerCase()}`;
    const url = "https://coinmarketcap.com/es/currencies/bitcoin/";
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
    console.log("Opening link:", url);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 w-full">
      <ScrollView className="flex-grow p-4">
        <View className="w-full max-w-md mx-auto">
          <Card className="elevation-3 rounded-lg">
            <Card.Cover
              source={{
                uri: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
              }}
              className="h-30"
            />
            <Card.Content>
              <Text className="text-3xl font-bold mb-4 mt-3">{cryptoName}</Text>
              <View className="mb-4">
                <Text className="text-xl font-semibold">Current Price</Text>
                <View className="flex flex-row justify-start items-center">
                  <Text className="text-2xl font-bold">
                    ${currentPrice.toFixed(2)}
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
                      {priceVariationPercentage}% (24h)
                    </Text>
                  </View>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-xl font-semibold">Market Cap</Text>
                <Text className="text-2xl font-bold">
                  ${marketCap.toLocaleString()}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-xl font-semibold">
                  Circulating Supply
                </Text>
                <Text className="text-2xl font-bold">
                  {circulatingSupply.toLocaleString()}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-xl font-semibold">Total Supply</Text>
                <Text className="text-2xl font-bold">
                  {totalSupply.toLocaleString()}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-xl font-semibold">24h Volume</Text>
                <Text className="text-2xl font-bold">
                  ${volume24h.toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={openLink}
                className="absolute top-1 right-3 p-2 rounded-full"
              >
                <FontAwesome5 name="external-link-alt" size={30} color="gray" />
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MarketInfoScreen;
