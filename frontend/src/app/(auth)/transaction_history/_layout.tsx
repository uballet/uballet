import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Card, List, Text } from "react-native-paper";
import { useRecentTransactions } from "../../../hooks/useRecentTransactions";
import MovementsList from "../../../components/movementsList";

const TransactionHistory: React.FC = () => {
  const { data, isLoading } = useRecentTransactions();

  if (isLoading || !data) {
    return (
      <View className="items-center justify-center">
        <ActivityIndicator />
        <Text className="text-sm">Loading Transactions</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Card style={{marginTop: 40}} mode="elevated">
        <Card.Content>
          <Card.Title title="All Transaction History" />
          <MovementsList 
            toTransfers={data.toTransfers} 
            fromTransfers={data.fromTransfers}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default TransactionHistory;
