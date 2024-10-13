import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRecentTransactions } from "../../../hooks/useRecentTransactions";
import MovementsList from "../../../components/MovementsList/MovementsList";

const TransactionHistory = () => {
  const { fromTransfers, toTransfers } = useRecentTransactions();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <MovementsList 
          toTransfers={toTransfers} 
          fromTransfers={fromTransfers} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  innerContainer: {
    padding: 12, 
    backgroundColor: '#fff', 
  },
});

export default TransactionHistory;
