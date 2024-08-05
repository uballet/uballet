import React from "react";
import { View } from "react-native";
import { Card, List, Text } from "react-native-paper";
import { useBalance } from "../../../hooks/useBalance";
import { useTokenBalance } from "../../../hooks/useTokenBalance";
import styles from "../../../styles/styles";

const BalanceScreen: React.FC = () => {
  const balance = useBalance();
  const tokenBalances = useTokenBalance();

  return (
    <View style={{ ...styles.container, alignItems: "stretch" }}>
      <Text style={styles.screenHeader}>Balance</Text>
      <Card>
        <Card.Content>
          <List.Section>
            <List.Item
              title={"ETH"}
              titleStyle={styles.currency}
              key={"ETH"}
              right={() => (
                <Text style={styles.balanceAmount}>{balance?.toString()}</Text>
              )}
            />
            {Object.entries(tokenBalances).map(([symbol, amount]) => (
              <List.Item
                title={`${symbol}`}
                titleStyle={styles.currency}
                key={symbol}
                right={() => <Text style={styles.balanceAmount}>{amount}</Text>}
              />
            ))}
          </List.Section>
        </Card.Content>
      </Card>
    </View>
  );
};

export default BalanceScreen;
