import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Card, List, Text } from "react-native-paper";
import { useBalance } from "../../../hooks/useBalance";
import { useTokenBalance } from "../../../hooks/useTokenBalance";
import styles from "../../../styles/styles";
import PortfolioValueChart from "../../../components/PortfolioValueChart/PortfolioValueChart";
import UballetAPI from "../../../api/uballet";


const BalanceScreen: React.FC = () => {
  const balance = useBalance();
  const tokenBalances = useTokenBalance();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [data, setData] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);
  
  const [eth, setEth] = useState(0);
  const [ethUSD, setEthUSD] = useState(0)
  const[balanceTotal, setBalanceTotal] = useState(0)

 

  const [tokenBalancesInUSD, setTokenBalancesInUSD] = useState<string[]>([]);

  const onRefresh = () => {
    setRefreshing(true);

    // Simulación de una llamada de datos asincrónica
    setTimeout(() => {
      // Actualizar el estado con nuevos datos (o los mismos para este ejemplo)
      setData(prevData => [...prevData, `Item ${prevData.length + 1}`]);
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Empty the tokenBalancesInUSD array
      setTokenBalancesInUSD([]);
      for (const token in tokenBalances) {
        const response = await UballetAPI.getQuote({ coin: token });
        const quote = response.quote as number;
        console.log("Appending Quote for", token, ":", quote);
        const balace = tokenBalances[token]
        setTokenBalancesInUSD((prev) => [...prev, quote * balace]);
      }
      console.log("TokenBalancesInUSD", tokenBalancesInUSD);
    };

    const showBalance = () => {
      const tokenValues = Object.values(tokenBalancesInUSD);
      const numberArray = tokenValues.map(Number);
    
  
      // Sumamos todos los valores en tokenValues y ethUSD
      const balanceTotal = [...numberArray, ethUSD];

      console.log(balanceTotal)

      const sumaTotal = balanceTotal.reduce((a, b) => a + b, 0);
      setBalanceTotal(sumaTotal)
     
  }

    fetchData();
    showBalance()

  }, [balance, tokenBalances]);
 

  return (
    <ScrollView 
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>

    <View  style={{ ...styles.container, alignItems: "stretch" }}>
      <Text style={styles.screenHeader}>Balance</Text>
      <View>
        <Text>Total Balance </Text>
        <Text>{balanceTotal.toFixed(4)}</Text>
      </View>
      <Card style={styles.cardBalance}>
        <Card.Content>
          <List.Section>
            <List.Item
              title={"ETH"}
              titleStyle={styles.currency}
              key={"ETH"}
              right={() => (
                <View  style={styles.saldo}>
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
            </ScrollView>
  );
};

export default BalanceScreen;
