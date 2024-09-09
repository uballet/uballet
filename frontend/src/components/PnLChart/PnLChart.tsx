import { BarChart } from "react-native-chart-kit";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import styles from "../../styles/styles";
import { useEffect, useState } from "react";

const screenWidth = Dimensions.get("window").width - 32;

const PnLChart = () => {
  const title = "Daily PnL";
  const [subtitle, setSubtitle] = useState("");
  const [data, setData] = useState<any>(null); // Use appropriate type if needed
  const [loading, setLoading] = useState(true); // State for loading indicator
  useEffect(() => {
    // Simulate a delay
    const data = {
      labels: [
        "01-01",
        "01-02",
        "01-03",
        "01-04",
        "01-05",
        "01-06",
        "01-07",
        "01-08",
        "01-09",
        "01-10",
        "01-11",
        "01-12",
        "01-13",
        "01-14",
        "01-15",
      ],
      datasets: [
        {
          data: [20, 45, 28, -80, 99, 43, 7, 100, 9, -123, 11, 20, 123, 4, 5],
          colors: [
            () => "green",
            () => "green",
            () => "green",
            () => "red",
            () => "green",
            () => "green",
            () => "green",
            () => "green",
            () => "green",
            () => "red",
            () => "green",
            () => "green",
            () => "green",
            () => "green",
            () => "green",
          ],
        },
      ],
    };
    setData(data);
    const lastDate = `Last ${data.labels.length} days`;
    setSubtitle(lastDate);
    setLoading(false);
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "rgba(242, 242, 242, 0)",
    backgroundGradientTo: "rgba(242, 242, 242, 0)",
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: () => `rgba(0, 0, 0, 1)`,
    useShadowColorFromDataset: false, // optional
    propsForBackgroundLines: {
      strokeWidth: 3,
      strokeDasharray: 0,
      stroke: "#e0e0e0",
      strokeOpacity: 0.5,
    },
    propsForLabels: {
      fontSize: 11,
    },
    propsForVerticalLabels: {
      fontSize: 11,
      fill: "black",
    },
    barRadius: 0,
    barPercentage: 0.32,
    decimalPlaces: 0,
    style: {
      marginVertical: 11,
      borderRadius: 50,
    },
  };

  return (
    <>
      <View>
        <Text style={{ ...styles.screenHeader, textAlign: "left" }}>
          {title}
        </Text>
        <Text className="text-left -mt-5 mb-3">{subtitle}</Text>
        {loading ? (
          <View className="m-10">
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : (
          <BarChart
            data={data}
            width={screenWidth}
            height={220}
            yAxisLabel="$ "
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            yAxisSuffix=""
            decimalPlaces={0}
            withCustomBarColorFromData={true}
            showValuesOnTopOfBars={false}
            withVerticalLabels={true}
            flatColor={true}
            showBarTops={false}
            // Hide all values except the first and last
            hidePointsAtIndex={
              data.labels.length > 2
                ? Array.from(
                    { length: data.labels.length - 2 },
                    (_, i) => i + 1
                  )
                : []
            }
            xLabelsOffset={0}
          />
        )}
      </View>
    </>
  );
};

export default PnLChart;
