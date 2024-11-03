import { useState, useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import EstimateGasFees from "../../../components/EstimateGasFees/EstimateGasFees";
import { useCheckTransferSponsorship } from "../../../hooks/useCheckTransferSponsorship";
import styles from "../../../styles/styles";
import { theme } from "../../../styles/color";
import SponsorshipCard from '../../../components/SponsorshipCard/SponsorshipCard';
import { useERC20GasEstimation } from "../../../hooks/useGasEstimation";

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

  const { data, isLoading: isLoadingErc20, isError: isERC20EstimationError } = useERC20GasEstimation({ target: toAddress, data: "0x" });

  useEffect(() => {
    if (currency === eth_symbol) {
      checkTransferSponsorship(toAddress, amount);
    }
  }, [currency, toAddress, amount]);

  const handleNext = (usdcTokenGas?: string) => {
    router.push({
      pathname: "transfer/submit-transfer",
      params: { toAddress, amount, currency, usdcTokenGas },
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
            <View>
              <EstimateGasFees
                target={toAddress}
                data={"0x"}
              />
            </View>
          )}
        </Card>

        {/* Sponsorship Card */}
        {(
          <>
            <Text style={styles.infoText}>Sometimes, someone else can cover the fee. Here, we're checking if someone else can cover the fee for this transaction.</Text>
            <SponsorshipCard
              loadingSponsorship={loadingSponsorship}
              isSponsored={isSponsored ?? false}
            />
          </>
        )}
        <View className="mt-8 items-center">
        {(loadingSponsorship || isLoadingErc20) ? (
            <ActivityIndicator style={{ margin: 16 }} />
          ): !isERC20EstimationError && data && (
            <>
              <Text style={styles.infoText}>You can also pay gas with USDC.</Text>
              <Card className="m-2">
                  <View className="m-2">
                    <Text variant="labelLarge">Estimated Max Fees: {data!.formattedInUsdc} USDC </Text>
                  </View>
              </Card>
              <Text variant="labelLarge" className={data!.enoughInUsdc ? "text-green-700" : "text-red-700"}>Your USDC Balance: {data!.formattedUsdcBalance}</Text>
              <Button
                testID="transfer-gas-previous-button"
                mode="contained"
                disabled={!data!.enoughInUsdc}
                style={[styles.button, { width: 200 }]}
                onPress={() => handleNext(data?.formattedInUsdc)}
              >
                Pay Gas With USDC
              </Button>
          </>
        )}
        </View>
      </View>
      {/* Next Button at the Bottom */}
      <View style={{ paddingBottom: 20, alignItems: 'center' }}>
        {isSponsored && (
          <Text variant="labelLarge" style={{ color: theme.colors.success }}>We'll pay for gas!</Text>
        )}
        <Button
          testID="transfer-gas-next-button"
          mode="contained"
          style={[styles.button, { width: 200 }]}
          onPress={() => handleNext()}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

export default GasInfoScreen;
