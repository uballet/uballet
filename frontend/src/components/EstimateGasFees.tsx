import React, { useState } from "react";
import { View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useGasEstimation } from "../hooks/useGasEstimation";

interface EstimateGasFeesProps {
  target?: `0x${string}`;
  data: `0x${string}`;
}

const EstimateGasFees: React.FC<EstimateGasFeesProps> = ({
  target,
  data,
}) => {
  const { data: gasEstimation, isLoading, isError, error } = useGasEstimation({ target: target, data });

  if (isLoading) {
    return (
      <View className="items-center justify-center">
        <ActivityIndicator />
        <Text className="text-sm">Loading Gas Fee</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="items-center justify-center">
        <Text className="text-sm">Error: {error.message}</Text>
      </View>
    );
  }

  if (!gasEstimation) {
    return (
      <View className="items-center justify-center">
        <Text variant="labelLarge">No available ETH</Text>
      </View>
    )
  }

  return (
    <View>
      <Text variant="labelLarge">
        Estimated gas fees: {gasEstimation?.slice(0, 8)} ETH
      </Text>
    </View>
  );
};

export default EstimateGasFees;
