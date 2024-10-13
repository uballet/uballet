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
    paddingVertical: 16,  // Add some vertical padding around the scroll area
    paddingHorizontal: 12,  // Add horizontal padding
  },
  innerContainer: {
    borderWidth: 1,  // Optional: add a subtle border if needed for spacing
    borderColor: '#ddd',  // Light border color to simulate the card feel
    borderRadius: 8,  // Round the edges slightly
    padding: 12,  // Add padding inside to simulate the inner padding of the card
    backgroundColor: '#fff',  // Background color can help with contrast if needed
  },
});

export default TransactionHistory;
