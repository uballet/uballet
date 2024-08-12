import { LineChart } from "react-native-chart-kit";
import React from "react";
import { View, Text, BackHandler } from "react-native";
import { Card } from "react-native-paper";
import styles from "../../styles/styles";




const PortfolioValueChart = () => {

    const title = "Valor del Portafolio";
  return (
    <>
    <View>
      <Text style={styles.screenHeader}>{title}</Text>
        <Card style={styles.card}>

      <LineChart
        data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
                {
                    data: [
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                    ],
                },
            ],
        }}
        withInnerLines= {false}
        withOuterLines= {false}
        withVerticalLines={true}
        withHorizontalLines={true}
        width={375} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
            // backgroundColor: "#e5f4ff",
            backgroundGradientFrom:  "white" ,
            backgroundGradientTo:  "white",
            
            decimalPlaces: 1, // optional, defaults to 2dp
            color: (opacity = 1) => `blue`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
                borderRadius: 16,
            },
            propsForDots: {
                r: "4",
                
              
            },
        }}
        bezier
        style={{
            marginVertical: 8,
            borderRadius: 16,
        }}
        />
        </Card>
    </View>
        </>
  );
};

export default PortfolioValueChart;
