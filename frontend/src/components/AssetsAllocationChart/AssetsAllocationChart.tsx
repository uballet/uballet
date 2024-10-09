import { PieChart } from "react-native-chart-kit";
import { View, Text, ActivityIndicator } from "react-native";
import styles from "../../styles/styles";
import { useBalanceInUSDT } from "../../hooks/useBalanceInUSDT";
import { useEffect, useState } from "react";
import config from "../../../netconfig/erc20-token-info.json";

const AssetsAllocationChart = () => {
  const title = "Assets Allocation";
  const [subtitle, setSubtitle] = useState("");

  // Define colors for the chart
  let colors: { [key: string]: string } = {};
  colors.ETH = "black";
  for (const token of config.erc20_tokens) {
    colors[token.symbol] = token.color;
  }

  // Get the data from the useBalanceInUSDT hook
  const { data, loading, error } = useBalanceInUSDT();
  useEffect(() => {
    setSubtitle("In USDT values");
  }, [data]);

  // Filter tokens with zero balance
  const filteredData = Object.entries(data || {}).filter(
    ([key, value]) => value.balanceInUSDT > 0
  );

  // Parse data
  const parsedData = filteredData.map(([key, value]) => ({
    name: key,
    balance: value.balanceInUSDT,
    // Get the color from the colors object, or use a random color
    color:
      colors[key] || "#" + Math.floor(Math.random() * 16777215).toString(16),
    legendFontColor: colors[key],
    legendFontSize: 15,
  }));

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 255, 146, ${opacity})`,
    useShadowColorFromDataset: false, // optional
  };

  // Conditionally render the chart only when data is available
  if (error) {
    return (
      <View>
        <Text style={{ ...styles.screenHeader, textAlign: "left" }}>
          {title}
        </Text>
        <Text>Error: no data available</Text>
      </View>
    );
  }

  if (parsedData.length === 0 && !loading) {
    return (
      <View>
        <Text style={{ ...styles.screenHeader, textAlign: "left" }}>
          {title}
        </Text>
        <Text className="text-left -mt-5">{subtitle}</Text>
        <Text className="text-left mt-2 text-lg">
          No balances to show! Try adding tokens to your wallet
        </Text>
      </View>
    );
  }

  return (
    <>
      <View>
        <Text style={{ ...styles.screenHeader, textAlign: "left" }}>
          {title}
        </Text>
        <Text className="text-left -mt-5">{subtitle}</Text>
        {loading ? (
          <View className="m-10">
            <ActivityIndicator testID="ActivityIndicator" size="small" color="#0000ff" />
          </View>
        ) : (
          <View testID="assets-allocation-pie-chart">
            <PieChart
              data={parsedData}
              width={375}
              height={220}
              chartConfig={chartConfig}
              accessor={"balance"}
              backgroundColor={"transparent"}
              paddingLeft={"50"}
              center={[0, 0]}
              avoidFalseZero={true}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default AssetsAllocationChart;
