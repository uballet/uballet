import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import {
  useGasEstimation,
  useGasEstimationWithoutPaymaster,
} from "../../hooks/useGasEstimation";
import { useBlockchainContext } from "../../providers/BlockchainProvider";
import { useAccountContext } from "../../hooks/useAccountContext";
import {
  ARB_SEPOLIA_ALCHEMY_POLICY_ID,
  BASE_SEPOLIA_ALCHEMY_POLICY_ID,
  OPT_SEPOLIA_ALCHEMY_POLICY_ID,
  SEPOLIA_ALCHEMY_POLICY_ID,
  ARB_ALCHEMY_POLICY_ID,
  BASE_ALCHEMY_POLICY_ID,
  MAINNET_ALCHEMY_POLICY_ID,
  OPT_ALCHEMY_POLICY_ID,
} from "../../env";

interface EstimateGasFeesProps {
  address: `0x${string}`;
  tokenAddress?: `0x${string}`;
  amount: string;
}

const EstimateGasFees: React.FC<EstimateGasFeesProps> = ({
  address,
  tokenAddress,
  amount,
}) => {
  const {
    data: gasEstimation,
    isLoading,
    isError,
  } = useGasEstimation({
    address,
    amount,
    tokenAddress,
  });

  const {
    data: gasEstimationWithoutPaymaster,
    isLoading: isLoadingWithoutPaymaster,
    isError: isErrorWithoutPaymaster,
  } = useGasEstimationWithoutPaymaster({
    address,
    amount,
    tokenAddress,
  });

  const { blockchain } = useBlockchainContext();
  const blockchainName = blockchain.name;

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
  let isPolicyError = isConfiguredPolicy && isError && !isErrorWithoutPaymaster;
  let notEnoughEthToBuildUO =
    (!isConfiguredPolicy && isError && isErrorWithoutPaymaster) ||
    (isConfiguredPolicy && isError && isErrorWithoutPaymaster);
  let haveToPayGas =
    !isConfiguredPolicy && !isError && !isErrorWithoutPaymaster;

  let isLoadingSponsorship = isLoading || isLoadingWithoutPaymaster;

  if (isLoadingSponsorship) {
    return (
      <View style={{ margin: 8 }}>
        <Text variant="labelLarge" testID="ActivityIndicator">
          Loading gas fees...
        </Text>
      </View>
    );
  }

  // Good case: policy configured, no error in estimation, so we can sponsor the transaction
  if (!isLoading && isSponsored) {
    return (
      <View style={{ margin: 8 }}>
        <Text variant="labelLarge">Gas fees will be sponsored by us!</Text>
      </View>
    );
  }

  // Other good case: policy not configured, but enough eth to build UO
  if (!isLoading && haveToPayGas) {
    return (
      <View style={{ margin: 8 }}>
        <Text variant="labelLarge">
          Gas fees estimated: {gasEstimationWithoutPaymaster}
        </Text>
      </View>
    );
  }

  // In this case, we have to pay the gas fees because policy isnt configured
  if (!isLoading && notEnoughEthToBuildUO) {
    return (
      <View style={{ margin: 8 }}>
        <Text variant="labelLarge">
          Not enough ETH for gas fees in order to continue with the transaction
        </Text>
      </View>
    );
  }

  // Last case: policy configured with error in estimation. Expired policy, continue with paymaster data 0x
  if (!isLoadingSponsorship && isPolicyError) {
    return (
      <View style={{ margin: 8 }}>
        <Text variant="labelLarge">
          Gas fees estimated: {gasEstimationWithoutPaymaster}
        </Text>
      </View>
    );
  }
};

export default EstimateGasFees;
