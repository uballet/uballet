import React from 'react';
import { View, Text } from 'react-native';
import { useBalance } from '../../../hooks/useBalance';
import { useTokenBalance } from '../../../hooks/useTokenBalance';
import styles from '../../../styles/styles';

const BalanceScreen: React.FC = () => {
  const balance = useBalance();
  const tokenBalances = useTokenBalance();

  return (
    <View style={styles.balanceScreenContainer}>
      <Text style={styles.balanceScreenHeader}>Balance</Text>
      <View style={styles.balanceItem}>
        <Text style={styles.currency}>Ethereum</Text>
        <Text style={styles.balanceAmount}>{balance?.toString()} ETH</Text>
      </View>
      {Object.entries(tokenBalances).map(([symbol, amount]) => (
        <View key={symbol} style={styles.balanceItem}>
          <Text style={styles.currency}>{symbol}</Text>
          <Text style={styles.balanceAmount}>{amount}</Text>
        </View>
      ))}
    </View>
  );
};

export default BalanceScreen;
