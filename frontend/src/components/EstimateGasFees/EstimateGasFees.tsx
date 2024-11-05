import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Card, Text } from "react-native-paper";
import { useGasEstimation } from "../../hooks/useGasEstimation";
import { theme } from "../../styles/color";

interface EstimateGasFeesProps {
  target: `0x${string}`;
  data: `0x${string}`;
}

const EstimateGasFees: React.FC<EstimateGasFeesProps> = ({
  target,
  data,
}) => {
  const { data: gasEstimation, isLoading, isError } = useGasEstimation({
    target,
    data,
  })

  if (isLoading) {
    return (
      <View style={{ margin: 8 }}>
        <ActivityIndicator testID="ActivityIndicator" size="small" color={theme.colors.primary} />
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

  return (
    <View style={{ margin: 8 }}>
      <Text variant="labelLarge">Estimated Max Fees: {gasEstimation} ETH</Text>
    </View>
  );
};

export default EstimateGasFees;
