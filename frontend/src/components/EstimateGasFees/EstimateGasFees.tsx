import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import { parseEther, formatEther } from "viem";
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
  const [totalMaxFees, setTotalMaxFees] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const uo = await buildUserOperation(client, account, target, data);
      const preVerificationGas = BigInt(uo.preVerificationGas ?? 0);
      const callGasLimit = BigInt(uo.callGasLimit ?? 0);
      const verificationGasLimit = BigInt(uo.verificationGasLimit ?? 0);
      const maxFeePerGas = BigInt(uo.maxFeePerGas ?? 0);

      const totalGas = preVerificationGas + callGasLimit + verificationGasLimit;
      const maxFees = totalGas * maxFeePerGas;

      setTotalMaxFees(formatEther(maxFees));
    } catch (error) {
      setHasError(true);
      console.error("Error estimating gas fees:", error);
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

  if (hasError || !totalMaxFees || data === '0x') {
    return (
      <View style={{ margin: 8 }}>
        <Text variant="labelLarge">Unable to estimate gas fees</Text>
      </View>
    );
  }

  return (
    <View style={{ margin: 8 }}>
      <Text variant="labelLarge">Estimated Max Fees: {totalMaxFees} ETH</Text>
    </View>
  );
};

export default EstimateGasFees;
