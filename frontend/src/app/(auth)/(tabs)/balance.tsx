import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Card, List, Text } from "react-native-paper";
import { useBalance } from "../../../hooks/useBalance";
import { useTokenBalance } from "../../../hooks/useTokenBalance";
import styles from "../../../styles/styles";
import PortfolioValueChart from "../../../components/PortfolioValueChart/PortfolioValueChart";

const BalanceScreen: React.FC = () => {
  const balance = useBalance();
  const tokenBalances = useTokenBalance();
  const [eth, setEth] = useState(0);

  const fetchedData = async () => {
    try {
      const url =
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=1027&convert=USD";
  
      const headers = {
        Accepts: "application/json",
        "X-CMC_PRO_API_KEY": "b6d57d00-f3d3-4a64-ab6b-0d85b1340c84",
      };
  
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
  
      const data = await response.json();
      console.log("this is ",data);
      let ethUSD = await data.data["1027"].quote.USD.price;
       setEth(parseInt(ethUSD));
      
    } catch (error) {
      console.log("Esto no funciona maquinola", error)
      
    }

  };

  fetchedData();

  return (
    <View style={{ ...styles.container, alignItems: "stretch" }}>
      <Text style={styles.screenHeader}>Balance</Text>
      <Card style={styles.cardBalance}>
        <Card.Content>
          <List.Section>
            <List.Item
              title={"ETH"}
              titleStyle={styles.currency}
              key={"ETH"}
              right={() => (
                <View style={styles.saldo}>
                  <Text style={styles.balanceAmount}>
                    {balance?.toString()}
                  </Text>
                  <Text style={styles.balanceAmountInUSD}>{eth === "" ? "-" : (eth * balance).toFixed(4) } USDT</Text>
                </View>
              )}
            />
            {Object.entries(tokenBalances).map(([symbol, amount]) => (
              <List.Item
                title={`${symbol}`}
                titleStyle={styles.currency}
                key={symbol}
                right={() => (
                  <View>
                    <Text style={styles.balanceAmount}>{amount}</Text>
                    <Text style={styles.balanceAmountInUSD}>0 USDT</Text>
                  </View>
                )}
              />
            ))}
          </List.Section>
        </Card.Content>
      </Card>
      <PortfolioValueChart />
    </View>
  );
};

export default BalanceScreen;
