import React from 'react';
import { Stack } from "expo-router";
import { View } from "react-native";
import { Text, Card, FAB } from "react-native-paper";
import { router } from "expo-router";
import styles from "../../../styles/styles";

const PendingTransactionScreen: React.FC = () => {
  return (
    <View style={[styles.container, { flex: 1, justifyContent: 'center', paddingHorizontal: 16 }]}>

      {/* Centered content */}
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Card style={{ width: '100%', marginBottom: 24 }}>
          <Card.Content>
            {/* Information about the delay */}
            <Text variant="titleMedium" style={styles.item}>
              Transaction Delayed
            </Text>
            <Text variant="bodyMedium" style={styles.item}>
              The transaction is taking longer than expected to be mined. You can return to the home screen and check the status later in your transaction history.
            </Text>
          </Card.Content>
        </Card>

        {/* Home Button */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
          <FAB
            size="medium"
            icon="home"
            style={styles.fab}
            onPress={() => { router.navigate('/(auth)'); }}
          />
        </View>
      </View>
    </View>
  );
};

export default PendingTransactionScreen;
