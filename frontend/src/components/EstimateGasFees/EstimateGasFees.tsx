import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import { parseEther } from "viem";
import { LightAccount } from "@alchemy/aa-accounts";
import { AlchemySmartAccountClient } from "@alchemy/aa-alchemy";

interface EstimateGasFeesProps {
  client: AlchemySmartAccountClient;
  account: LightAccount;
  target: `0x${string}`;
  data: `0x${string}`;
}

const buildUserOperation = async (
  client: AlchemySmartAccountClient,
  account: LightAccount,
  target: `0x${string}`,
  data: `0x${string}`
) => {
  const uo = await client.buildUserOperation({
    account,
    uo: {
      target,
      data,
      value: parseEther("0.00001"),
    },
  });
  return uo;
};

const EstimateGasFees: React.FC<EstimateGasFeesProps> = ({
  client,
  account,
  target,
  data,
}) => {
  const [uoBuilt, setuoBuilt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const uo = await buildUserOperation(client, account, target, data);
      setuoBuilt(uo);
    } catch (error) {
      setHasError(true);
      console.error("Error building User Operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ margin: 8 }}>
        <ActivityIndicator testID="ActivityIndicator" size="small" color="#0000ff" />
      </View>
    );
  }

  if (hasError || !uoBuilt || !uoBuilt.preVerificationGas) {
    return (
      <View style={{ margin: 8 }}>
        <Text variant="labelLarge">No data is available</Text>
      </View>
    );
  }

  const preVerificationGas = parseInt(uoBuilt.preVerificationGas);
  const callGasLimit = parseInt(uoBuilt.callGasLimit);
  const verificationGasLimit = parseInt(uoBuilt.verificationGasLimit);
  const maxPriorityFeePerGas = parseInt(uoBuilt.maxPriorityFeePerGas) / 1000000000;
  const maxFeePerGas = parseInt(uoBuilt.maxFeePerGas) / 1000000000;

  return (
    <View style={{ margin: 8 }}>
      <Text variant="labelLarge">Pre Verification Gas Estimated: {preVerificationGas}</Text>
      <Text variant="labelLarge">Call Gas Limit Estimated: {callGasLimit}</Text>
      <Text variant="labelLarge">Verification Gas Limit Estimated: {verificationGasLimit}</Text>
      <Text variant="labelLarge">Max Priority Fee Per Gas in gwei: {maxPriorityFeePerGas}</Text>
      <Text variant="labelLarge">Max Fee Per Gas in gwei: {maxFeePerGas}</Text>
    </View>
  );
};

export default EstimateGasFees;
