import { AssetTransfersWithMetadataResult } from "alchemy-sdk";
import React from "react";
import { ScrollView } from "react-native";
import { Card, List, Text } from "react-native-paper";
import { useRecentTransactions } from "../../../hooks/useRecentTransactions";
import MovementsList from "../../../components/movementsList";
import styles from "../../../styles/styles";

const TransactionHistory: React.FC = () => {
  const { fromTransfers, toTransfers } = useRecentTransactions();

  return (
    <ScrollView>
      <Card style={{marginTop: 40}} mode="elevated">
        <Card.Content>
          <Card.Title title="All Transaction History" />
          <MovementsList 
            toTransfers={toTransfers} 
            fromTransfers={fromTransfers} 
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default TransactionHistory;
