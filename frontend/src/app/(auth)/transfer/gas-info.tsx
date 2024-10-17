import { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import EstimateGasFees from "../../../components/EstimateGasFees/EstimateGasFees";
import { useSafeLightAccount } from "../../../hooks/useLightAccount";
import { useCheckTransferSponsorship } from "../../../hooks/useCheckTransferSponsorship";
import { useAlchemyClient } from "../../../hooks/useAlchemyClient";
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
  const account = useSafeLightAccount();
  const client = useAlchemyClient();
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

  const handleEstimateGasClick = () => {
    setIsGasFeeCardExpanded(!isGasFeeCardExpanded);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20 }}>
        
        {/* Gas Fees Explanation and Button */}
        <Text style={styles.infoText}> Ethereum transactions require a small fee called 'gas'. Press this button to get an estimate of how much gas you'll need to pay to complete your transaction. </Text>
        <Button
          mode="contained"
          style={{
            ...styles.button,
            backgroundColor: "#000",
          }}
          onPress={handleEstimateGasClick}
          textColor="white"
        >
          Estimate Gas Fees
        </Button>

        {isGasFeeCardExpanded && (
          <Card style={{ margin: 8 }}>
            <EstimateGasFees
              client={client}
              account={account}
              target={toAddress}
              data={"0x"}
            />
          </Card>
        )}

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
