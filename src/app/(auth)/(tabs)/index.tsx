import React from 'react';
import { View, ScrollView } from 'react-native';
import { ActivityIndicator, Avatar, Card, FAB, List, Text } from 'react-native-paper';
import { Link } from 'expo-router';
import styles from '../../../styles/styles';
import { useBalance } from '../../../hooks/useBalance';

const HomeScreen: React.FC = () => {
  const balance = useBalance()

  console.log({ balance })
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
      <Card style={styles.movementsContainer}>
        <List.Section>
        <List.Subheader>Movements</List.Subheader>
        {[...Array(6)].map((_, index) => (
           <List.Item
           title="Some address - 10/11/12 12:00am"
           description="-0.0523"
           key={index}
         />
        ))}
        </List.Section>
      </Card>
    </ScrollView>
  );
};

export default HomeScreen;
