import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Card, Text } from "react-native-paper";
import { useGasEstimation } from "../../hooks/useGasEstimation";
import { theme } from "../../styles/color";

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

  if (isLoading) {
    return (
      <View style={{ margin: 8 }}>
        <ActivityIndicator
          testID="ActivityIndicator"
          size="small"
          color={theme.colors.primary}
        />
      </View>
    );
  }

  if (isError || !gasEstimation || gasEstimation === "0") {
    return (
      <View style={{ margin: 8 }}>
        <Text variant="labelLarge">Unable to estimate gas fees</Text>
      </View>
    );
  }

  const gasEstimationParsed = parseFloat(gasEstimation).toFixed(6);
  return (
    <View style={{ margin: 8 }}>
      <Text variant="labelLarge">
        Estimated Max Fees in ETH: {gasEstimationParsed} ETH
      </Text>
    </View>
  );
};

export default EstimateGasFees;
