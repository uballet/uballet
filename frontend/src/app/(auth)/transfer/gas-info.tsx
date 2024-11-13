import { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import styles from "../../../styles/styles";
import { theme } from "../../../styles/color";
import SponsorshipCard from "../../../components/SponsorshipCard/SponsorshipCard";
import {
  useERC20GasEstimation,
  useGasEstimation,
  useGasEstimationWithoutPaymaster,
} from "../../../hooks/useGasEstimation";
import UballetSpinner from "../../../components/UballetSpinner/UballetSpinner";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import {
  ARB_SEPOLIA_ALCHEMY_POLICY_ID,
  BASE_SEPOLIA_ALCHEMY_POLICY_ID,
  OPT_SEPOLIA_ALCHEMY_POLICY_ID,
  SEPOLIA_ALCHEMY_POLICY_ID,
  ARB_ALCHEMY_POLICY_ID,
  BASE_ALCHEMY_POLICY_ID,
  MAINNET_ALCHEMY_POLICY_ID,
  OPT_ALCHEMY_POLICY_ID,
} from "../../../env";
import { useBalance } from "../../../hooks/useBalance";

function GasInfoScreen() {
  const { toAddress, amount, currency } = useLocalSearchParams<{
    toAddress: `0x${string}`;
    amount: string;
    currency: string;
  }>();

  const { blockchain } = useBlockchainContext();
  const blockchainName = blockchain.name;
  const tokens = blockchain.erc20_tokens;
  const eth_symbol = "ETH";
  const tokenAddresses = tokens.reduce<{ [key: string]: `0x${string}` }>(
    (acc, token) => {
      acc[token.symbol] = token.address as `0x${string}`;
      return acc;
    },
    {}
  );

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

  const {
    data: gasEstimationWithoutPaymaster,
    isLoading: isLoadingWithoutPaymaster,
    isError: isErrorWithoutPaymaster,
  } = useGasEstimationWithoutPaymaster({
    address: toAddress,
    amount,
    tokenAddress: tokenAddresses[currency],
  });

  console.log("blockchainName:", blockchainName);

  let isConfiguredPolicy = false;
  if (blockchainName === "Sepolia") {
    if (SEPOLIA_ALCHEMY_POLICY_ID) {
      console.log("SEPOLIA_ALCHEMY_POLICY_ID:", SEPOLIA_ALCHEMY_POLICY_ID);
      isConfiguredPolicy = true;
    }
  } else if (blockchainName === "Optimism Sepolia") {
    if (OPT_SEPOLIA_ALCHEMY_POLICY_ID) {
      console.log(
        "OPT_SEPOLIA_ALCHEMY_POLICY_ID:",
        OPT_SEPOLIA_ALCHEMY_POLICY_ID
      );
      isConfiguredPolicy = true;
    }
  } else if (blockchainName === "Arbitrum Sepolia") {
    if (ARB_SEPOLIA_ALCHEMY_POLICY_ID) {
      console.log(
        "ARB_SEPOLIA_ALCHEMY_POLICY_ID:",
        ARB_SEPOLIA_ALCHEMY_POLICY_ID
      );
      isConfiguredPolicy = true;
    }
  } else if (blockchainName === "Base Sepolia") {
    if (BASE_SEPOLIA_ALCHEMY_POLICY_ID) {
      console.log(
        "BASE_SEPOLIA_ALCHEMY_POLICY_ID:",
        BASE_SEPOLIA_ALCHEMY_POLICY_ID
      );
      isConfiguredPolicy = true;
    }
  } else {
    // In this case, we are in Mainnet (ARB, BASE, OPT or ETH). So assume no policy is configured
    isConfiguredPolicy = false;
  }

  console.log("isConfiguredPolicy:", isConfiguredPolicy);

  console.log("gasEstimation", gasEstimation);
  console.log("isLoading", isLoading);
  console.log("isError", isError);

  console.log("gasEstimationWithoutPaymaster", gasEstimationWithoutPaymaster);
  console.log("isLoadingWithoutPaymaster", isLoadingWithoutPaymaster);
  console.log("isErrorWithoutPaymaster", isErrorWithoutPaymaster);

  let isSponsored = isConfiguredPolicy && !isError;
  let notEnoughEthToBuildUO =
    (!isConfiguredPolicy && isError && isErrorWithoutPaymaster) ||
    (isConfiguredPolicy && isError && isErrorWithoutPaymaster);
  let haveToPayGas =
    (!isConfiguredPolicy && !isError && !isErrorWithoutPaymaster) ||
    (isConfiguredPolicy && !isError && !isErrorWithoutPaymaster) ||
    (isConfiguredPolicy && isError && !isErrorWithoutPaymaster);

  let isLoadingSponsorship = isLoading || isLoadingWithoutPaymaster;

  const { data: balance, isLoading: isLoadingBalance } = useBalance();
  const parsedBalance = parseFloat(balance);
  const parsedAmount = parseFloat(amount);
  const parsedGas = parseFloat(gasEstimationWithoutPaymaster);
  let disabledPayGasWithEth = true;

  // Case when there is a policy configured and there is no error
  if (isConfiguredPolicy && !isError) {
    haveToPayGas = false;
    isSponsored = true;
    notEnoughEthToBuildUO = false;
    disabledPayGasWithEth = true;
  }

  // Case when there is a policy configured and there is an error (policy desactivated or limit reached)
  // Or the case where there is no policy configured (Mainnets)
  if ((isConfiguredPolicy && isError) || !isConfiguredPolicy) {
    // Check if there is enough ETH to build UO
    if (currency != "ETH" && parsedBalance <= parsedGas) {
      console.log("Not enough ETH to build UO");
      notEnoughEthToBuildUO = true;
      disabledPayGasWithEth = true;
    } else if (
      currency === "ETH" &&
      parsedBalance <= parsedGas + parsedAmount
    ) {
      console.log("Not enough ETH to build UO");
      notEnoughEthToBuildUO = true;
      disabledPayGasWithEth = true;
    } else {
      notEnoughEthToBuildUO = false;
      disabledPayGasWithEth = false;
    }
    isSponsored = false;
    haveToPayGas = true;
  }

  useEffect(() => {}, [currency, toAddress, amount]);

  const handleNextPayGasWithEth = () => {
    const isSponsored = "no";
    router.push({
      pathname: "transfer/submit-transfer",
      params: {
        toAddress,
        amount,
        currency,
        usdcTokenGas: undefined,
        gasEstimation: gasEstimationWithoutPaymaster,
        isSponsored,
      },
    });
  };

  const handleNextSponsored = () => {
    const isSponsored = "yes";
    router.push({
      pathname: "transfer/submit-transfer",
      params: {
        toAddress,
        amount,
        currency,
        usdcTokenGas: undefined,
        gasEstimation: undefined,
        isSponsored,
      },
    });
  };

  const handleNext = (usdcTokenGas?: string) => {
    const isSponsored = "no";
    router.push({
      pathname: "transfer/submit-transfer",
      params: {
        toAddress,
        amount,
        currency,
        usdcTokenGas,
        gasEstimation: undefined,
        isSponsored,
      },
    });
  };

  if (isLoadingErc20 || isLoadingSponsorship) {
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
            {isLoadingSponsorship ? (
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
                {isSponsored ? (
                  <Text style={{ ...styles.infoText, color: "green" }}>
                    Gas fees will be sponsored by us!
                  </Text>
                ) : notEnoughEthToBuildUO ? (
                  <Text style={{ ...styles.infoText, color: "red" }}>
                    Not enough ETH for gas fees in order to continue with the
                    transaction.
                  </Text>
                ) : haveToPayGas ? (
                  <Text style={{ ...styles.infoText, color: "black" }}>
                    Gas fees estimated: {gasEstimationWithoutPaymaster}.
                  </Text>
                ) : (
                  <Text style={{ ...styles.infoText, color: "red" }}>
                    Not valid case. Please contact support.
                  </Text>
                )}
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
                <Button
                  testID="transfer-gas-next-button"
                  mode="contained"
                  disabled={disabledPayGasWithEth}
                  style={styles.button}
                  onPress={() => handleNextPayGasWithEth()}
                >
                  Pay Gas With ETH
                </Button>
                <SponsorshipCard
                  loadingSponsorship={isLoadingSponsorship}
                  isSponsored={isSponsored}
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
          {haveToPayGas && !isLoading && isLoadingErc20 && <UballetSpinner />}
          {haveToPayGas && !isLoading && data?.formattedInUsdc && (
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
          disabled={!isSponsored}
          style={styles.button}
          onPress={() => handleNextSponsored()}
        >
          Continue with sponsored transaction
        </Button>
      </View>
    </View>
  );
}

export default GasInfoScreen;
