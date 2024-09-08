import { PieChart } from "react-native-chart-kit";
import { View, Text, ActivityIndicator } from "react-native";
import styles from "../../styles/styles";
import { useBalanceInUSDT } from "../../hooks/useBalanceInUSDT";

const AssetsAllocationChart = () => {
  const title = "Assets Allocation";
  const subtitle = "In USDT values";
  let colors: { [key: string]: string } = {
    Ethereum: "black",
    USDC: "blue",
    USDT: "green",
    DAI: "#FFB800",
  };

  const { data, loading, error } = useBalanceInUSDT();

  const parsedData = Object.entries(data || {}).map(([key, value]) => ({
    name: key,
    balance: value,
    color: colors[key],
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
    return <Text>No data available</Text>;
  }

  return (
    <>
      <View>
        <Text style={styles.screenHeader}>{title}</Text>
        <Text className="text-center -mt-5">{subtitle}</Text>
        {loading ? (
          <View className="m-10">
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : (
          <PieChart
            data={parsedData}
            width={375}
            height={220}
            chartConfig={chartConfig}
            accessor={"balance"}
            backgroundColor={"transparent"}
            paddingLeft={"50"}
            center={[0, 0]}
          />
        )}
      </View>
    </>
  );
};

export default AssetsAllocationChart;
