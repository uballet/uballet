import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Card, List, Text } from "react-native-paper";
import { useBalance } from "../../../hooks/useBalance";
import { useTokenBalance } from "../../../hooks/useTokenBalance";
import styles from "../../../styles/styles";
import PortfolioValueChart from "../../../components/PortfolioValueChart/PortfolioValueChart";
import UballetAPI from "../../../api/uballet";

const BalanceScreen: React.FC = () => {
  const balance = useBalance();
  const tokenBalances = useTokenBalance();
  const [eth, setEth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await UballetAPI.getQuote({ coin: "ETH" });
      const quote = await response.coin;
      setEth(parseInt(quote));
    };

    fetchData();
  }, []);

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
                  <Text style={styles.balanceAmountInUSD}>
                    {eth === "" ? "-" : (eth * balance).toFixed(4)} USDT
                  </Text>
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
