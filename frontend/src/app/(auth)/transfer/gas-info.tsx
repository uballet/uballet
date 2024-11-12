import { useState, useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import EstimateGasFees from "../../../components/EstimateGasFees/EstimateGasFees";
import { useCheckTransferSponsorship } from "../../../hooks/useCheckTransferSponsorship";
import styles from "../../../styles/styles";
import { theme } from "../../../styles/color";
import SponsorshipCard from "../../../components/SponsorshipCard/SponsorshipCard";
import {
  useERC20GasEstimation,
  useGasEstimation,
} from "../../../hooks/useGasEstimation";
import UballetSpinner from "../../../components/UballetSpinner/UballetSpinner";
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

  const {
    data,
    isLoading: isLoadingErc20,
    isError: isERC20EstimationError,
  } = useERC20GasEstimation({
    address: toAddress,
    amount,
    tokenAddress: tokenAddresses[currency],
  });

  const {
    data: gasEstimation,
    isLoading,
    isError,
  } = useGasEstimation({
    address: toAddress,
    amount,
    tokenAddress: tokenAddresses[currency],
  });

  console.log("Gas Estimation: ", gasEstimation);

  useEffect(() => {
    if (currency === eth_symbol) {
      checkTransferSponsorship(toAddress, amount);
    }
    // checkTransferSponsorship(toAddress, amount);
  }, [currency, toAddress, amount]);

  const handleNext = (usdcTokenGas?: string) => {
    router.push({
      pathname: "transfer/submit-transfer",
      params: {
        toAddress,
        amount,
        currency,
        usdcTokenGas,
        gasEstimation,
        isSponsored,
      },
    });
  };

  if (isLoadingErc20 || loadingSponsorship) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 100,
          }}
        >
          <UballetSpinner />
        </View>
      </View>
    );
  }

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
          alignItems: "stretch",
          width: "100%",
          paddingHorizontal: 20,
          marginTop: 4,
        }}
      >
        {/* Gas Fees Explanation and Button */}
        <Card style={{ marginVertical: 12 }}>
          <Card.Content>
            <Text style={{ ...styles.infoText }}>
              Transaction gas estimation.
            </Text>
            <Text style={{ ...styles.infoText, color: "gray" }}>
              Ethereum transactions require a small fee called 'gas'. Here's an
              estimate of how much gas you'll need to pay to complete your
              transaction:
            </Text>
            {loadingSponsorship ? (
              <UballetSpinner />
            ) : (
              <View
                style={{
                  flex: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <EstimateGasFees
                  address={toAddress}
                  amount={amount}
                  tokenAddress={tokenAddresses[currency]}
                />
              </View>
            )}
            {/* Sponsorship Card */}
            {
              <>
                <Text style={{ ...styles.infoText, color: "gray" }}>
                  Sometimes, someone else can cover the fee. Here, we're
                  checking if someone else can cover the fee for this
                  transaction.
                </Text>
                <SponsorshipCard
                  loadingSponsorship={loadingSponsorship}
                  isSponsored={isSponsored ?? false}
                />
              </>
            }
          </Card.Content>
        </Card>

        <View
          className="mt-0"
          style={{
            flex: 1,
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {!isSponsored && !loadingSponsorship && isLoadingErc20 && (
            <UballetSpinner />
          )}
          {!isSponsored && !loadingSponsorship && data?.formattedInUsdc && (
            <Card>
              <Card.Content>
                <Text style={styles.infoText}>
                  You can also pay gas with USDC.
                </Text>
                <Text style={{ ...styles.infoText, color: "gray" }}>
                  If gas fees sponsorhip is not available, you can pay gas fees
                  with USDC to complete your transaction.
                </Text>

                <View className="m-2" style={{ alignItems: "center" }}>
                  <Text variant="labelLarge">
                    Estimated Max Fees in USDC: {data!.formattedInUsdc} USDC{" "}
                  </Text>
                </View>

                <Button
                  testID="transfer-gas-previous-button"
                  mode="contained"
                  disabled={!data!.enoughInUsdc}
                  style={[styles.button]}
                  onPress={() => handleNext(data?.formattedInUsdc)}
                >
                  Pay Gas With USDC
                </Button>
                <Text
                  variant="labelLarge"
                  style={{
                    textAlign: "center",
                    color: data!.enoughInUsdc ? "green" : "red", // Apply green or custom red depending on the condition
                  }}
                >
                  Your USDC Balance: {data!.formattedUsdcBalance}
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </View>

      {/* Next Button at the Bottom */}
      <View
        style={{
          paddingBottom: 4,
          paddingHorizontal: 0,
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
