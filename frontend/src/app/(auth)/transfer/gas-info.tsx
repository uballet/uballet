import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import EstimateGasFees from "../../../components/EstimateGasFees/EstimateGasFees";
import { useSafeLightAccount } from "../../../hooks/useLightAccount";
import { useCheckTransferSponsorship } from "../../../hooks/useCheckTransferSponsorship";
import { useAlchemyClient } from "../../../hooks/useAlchemyClient";
import styles from "../../../styles/styles";
import { theme } from "../../../styles/color"

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

  const handleNext = () => {
    router.push({
      pathname: "transfer/submit-transfer",
      params: { toAddress, amount, currency },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20 }}>
        
        {/* Gas Fees Explanation and Estimate Button */}
        <Text style={styles.infoText}> Ethereum transactions require a small fee called 'gas'. Press this button to get an estimate of how much gas you'll need to pay to complete your transaction. </Text>
        <TouchableOpacity
          onPress={() => setIsGasFeeCardExpanded(!isGasFeeCardExpanded)}
        >
          <View style={{ margin: 8, backgroundColor: "#f5f5f5", padding: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Estimate Gas Fees</Text>
          </View>
        </TouchableOpacity>

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

        {/* Sponsorship Explanation and Button */}
        <Text style={styles.infoText}> Sometimes, a sponsor can pay your gas fees for you. This button checks if someone else can cover the gas cost for this transaction. </Text>
        {currency === eth_symbol && (
          <Button
            style={{
              ...styles.button,
              backgroundColor: loadingSponsorship
                ? "#CCCCCC"
                : isSponsored === null
                ? "black"
                : isSponsored
                ? "green"
                : "red",
            }}
            loading={loadingSponsorship}
            onPress={() => checkTransferSponsorship(toAddress, amount)}
            textColor="white"
          >
            {isSponsored === null
              ? "Check sponsorship"
              : isSponsored
              ? "We'll pay for gas!"
              : "You'll pay for gas"}
          </Button>
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
