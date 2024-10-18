import { useState, useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import EstimateGasFees from "../../../components/EstimateGasFees/EstimateGasFees";
import { useCheckTransferSponsorship } from "../../../hooks/useCheckTransferSponsorship";
import styles from "../../../styles/styles";
import { theme } from "../../../styles/color";
import SponsorshipCard from '../../../components/SponsorshipCard/SponsorshipCard';

function GasInfoScreen() {
  const { toAddress, amount, currency } = useLocalSearchParams<{ 
    toAddress: `0x${string}`, 
    amount: string, 
    currency: string 
  }>();

  const eth_symbol = "ETH";
  const {
    checkTransferSponsorship,
    loading: loadingSponsorship,
    setIsSponsored,
    isSponsored,
  } = useCheckTransferSponsorship();
  const [isGasFeeCardExpanded, setIsGasFeeCardExpanded] = useState(false);

  useEffect(() => {
    if (currency === eth_symbol) {
      checkTransferSponsorship(toAddress, amount);
    }
  }, [currency, toAddress, amount]);

  const handleNext = () => {
    router.push({
      pathname: "transfer/submit-transfer",
      params: { toAddress, amount, currency },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20 }}>
        
        {/* Gas Fees Explanation and Button */}
        <Text style={styles.infoText}>Ethereum transactions require a small fee called 'gas'. Here's an estimate of how much gas you'll need to pay to complete your transaction:</Text>
        <Card style={{ margin: 8 }}>
          {loadingSponsorship ? (
            <ActivityIndicator style={{ margin: 16 }} />
          ) : (
            <EstimateGasFees
              target={toAddress}
              data={"0x"}
            />
          )}
        </Card>

        {/* Sponsorship Card */}
        {currency === eth_symbol && (
          <>
            <Text style={styles.infoText}>Sometimes, someone else can cover the fee. Here, we're checking if someone else can cover the fee for this transaction.</Text>
            <SponsorshipCard
              loadingSponsorship={loadingSponsorship}
              isSponsored={isSponsored ?? false}
            />
          </>
        )}
      </View>

      {/* Next Button at the Bottom */}
      <View style={{ paddingBottom: 20, alignItems: 'center' }}>
        <Button
          mode="contained"
          style={[styles.button, { width: 200 }]}
          onPress={handleNext}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

export default GasInfoScreen;
