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
import { useBlockchainContext } from "../../../providers/BlockchainProvider";

function GasInfoScreen() {
  const { toAddress, amount, currency } = useLocalSearchParams<{
    toAddress: `0x${string}`;
    amount: string;
    currency: string;
  }>();

  const { blockchain } = useBlockchainContext();
  const tokens = blockchain.erc20_tokens;
  const tokenAddresses = tokens.reduce<{ [key: string]: `0x${string}` }>(
    (acc, token) => {
      acc[token.symbol] = token.address as `0x${string}`;
      return acc;
    },
    {}
  );

  const eth_symbol = "ETH";
  const {
    checkTransferSponsorship,
    loading: loadingSponsorship,
    setIsSponsored,
    isSponsored,
  } = useCheckTransferSponsorship();

  const { data, isLoading: isLoadingErc20, isError: isERC20EstimationError } = useERC20GasEstimation({ address: toAddress, amount, tokenAddress: tokenAddresses[currency] });

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
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "stretch",
          width: "100%",
          paddingHorizontal: 20,
        }}
      >
        {/* Gas Fees Explanation and Button */}
        <Card style={{ margin: 8 }} mode="contained">
          <Card.Content>
            <Text style={styles.infoText}>
              Ethereum transactions require a small fee called 'gas'. Here's an
              estimate of how much gas you'll need to pay to complete your
              transaction:
            </Text>
          </Card.Content>
        </Card>
        <Card style={{ margin: 8 }}>
          <Card.Content>
            {loadingSponsorship ? (
              <ActivityIndicator style={{ margin: 16 }} />
            ) : (
              <EstimateGasFees address={toAddress} amount={amount} tokenAddress={tokenAddresses[currency]} />
            )}
          </Card.Content>
        </Card>

        {/* Sponsorship Card */}
        {(
          <>
            <Text style={{ ...styles.infoText, margin: 8 }}>
              Sometimes, someone else can cover the fee. Here, we're checking if
              someone else can cover the fee for this transaction.
            </Text>
            <SponsorshipCard
              loadingSponsorship={loadingSponsorship}
              isSponsored={isSponsored ?? false}
            />
          </>
        )}
        <View className="mt-8 items-center">
          {!isSponsored && !loadingSponsorship && isLoadingErc20 && (
              <ActivityIndicator style={{ margin: 16 }} />
          )}
          {!isSponsored && !loadingSponsorship && data?.formattedInUsdc && (
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
      <View
        style={{
          paddingBottom: 20,
          alignItems: "center",
          marginHorizontal: 16,
        }}
      >
        <Button
          testID="transfer-gas-next-button"
          mode="contained"
          style={styles.button}
          onPress={() => handleNext()}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

export default GasInfoScreen;
