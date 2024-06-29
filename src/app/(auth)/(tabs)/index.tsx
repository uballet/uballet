import React from 'react';
import { View, ScrollView } from 'react-native';
import { ActivityIndicator, Avatar, Card, FAB, List, Text } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import styles from '../../../styles/styles';
import { useBalance } from '../../../hooks/useBalance';
import { useRecentTransactions } from '../../../hooks/useRecentTransactions';

const formatTxAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(36)}`
}
const HomeScreen: React.FC = () => {
  const balance = useBalance()
  const { fromTransfers, toTransfers } = useRecentTransactions()

  return (
    <ScrollView >
      <Avatar.Icon style={styles.userSettings} size={30} icon="account" />
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceHeader}>Balance</Text>
        {balance !== null
          ? (<Text style={styles.balance}>{balance?.toString()} eth</Text>)
          : <ActivityIndicator />
        }
        <Link href="balance" style={styles.seeAll}>
          <Text>See all</Text>
        </Link>
      </View>
      <View style={styles.keyFeatures}>
        <FAB size="small" icon="bank-transfer"/>
        <FAB size="small" icon="cash-plus"/>
        <FAB size="small" icon="cash-minus"/>
        <FAB size="small" icon="account-cash-outline"/>
      </View>
      <View style={styles.movementsContainer}>
        <Text style={styles.movementsHeader}>Movements</Text>
        <Text style={styles.movementsHeader}>Received</Text>
        {!toTransfers && (
          <ActivityIndicator />
        )}
        {toTransfers && toTransfers.map((transfer, index) => (
          <View key={index} style={styles.movementRow}>
            <Text>{`From: ${formatTxAddress(transfer.from)} - Block: ${transfer.blockNum}`}</Text>
            <Text style={{ color: 'green' }}>{transfer.value}</Text>
          </View>
        ))}
        <Text style={styles.movementsHeader}>Sent</Text>
        {!fromTransfers && (
          <ActivityIndicator />
        )}
        {fromTransfers && fromTransfers.map((transfer, index) => (
          <View key={index} style={styles.movementRow}>
            <Text>{`From: ${formatTxAddress(transfer.from)} - Block: ${transfer.blockNum}`}</Text>
            <Text style={{ color: 'red' }}>{transfer.value}</Text>
          </View>
        ))}        
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
