import { LineChart } from "react-native-chart-kit";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import styles from "../../styles/styles";
import { useEffect, useState } from "react";
import UballetAPI from "../../api/uballet";

const screenWidth = Dimensions.get("window").width - 32;

const PortfolioValueChart = () => {
  const [data, setData] = useState<any>(null); // Use appropriate type if needed
  const [loading, setLoading] = useState(true); // State for loading indicator
  const title = "Portafolio Value";
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UballetAPI.getPortfolioData({ days: 14 });
        // Parse fetched data into { labels: string[], datasets: { data: number[] }[] }
        let labels = [];
        for (let i = 0; i < response.length; i++) {
          const date = response[i].date;
          // Get the first 7 characters of the date
          const dateParts = date.split("-");
          const parsedDate = `${dateParts[1]}-${dateParts[2]}`;
          labels.push(parsedDate);
        }
        let data = [];
        for (let i = 0; i < response.length; i++) {
          data.push(response[i].value);
        }
        const parsedData = {
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        };
        // Make format string
        const lastDate = `Last ${labels.length} days`;
        console.log("parsedData:", parsedData);
        setData(parsedData);
        setSubtitle(lastDate);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data only once

  return (
    <View>
      <Text
        style={{ ...styles.screenHeader, textAlign: "left" }}
        className="-mt-1"
      >
        {title}
      </Text>
      <Text className="text-left -mt-5 mb-3">{subtitle}</Text>
      <View>
        {loading ? (
          <View className="m-10">
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : (
          <LineChart
            data={data}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={true}
            withHorizontalLines={false}
            width={screenWidth}
            height={220}
            yAxisLabel="$ "
            verticalLabelRotation={0}
            chartConfig={{
              backgroundGradientFrom: "rgba(242, 242, 242, 0)",
              backgroundGradientTo: "rgba(242, 242, 242, 0)",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `black`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "0",
              },
              propsForHorizontalLabels: {
                fontSize: 11,
              },
              propsForVerticalLabels: {
                fontSize: 11,
              },
              strokeWidth: 2, // optional, default 3
            }}
            xLabelsOffset={2}
            // Hide 1 to len(data) points
            hidePointsAtIndex={Array.from(
              { length: data.labels.length - 2 },
              (_, i) => i + 1
            )}
            bezier
          />
        )}
      </View>
    </View>
  );
};

export default PortfolioValueChart;
