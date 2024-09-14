import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { parseEther } from "viem";
import styles from "../styles/styles";
import { useAccountContext } from "../hooks/useAccountContext";
import { type AlchemyAccountClient } from "../providers/AccountProvider";
interface EstimateGasFeesProps {
  target: `0x${string}`;
  data: `0x${string}`;
}

const buildUserOperation = async (
  account: AlchemyAccountClient,
  target: `0x${string}`,
  data: `0x${string}`
) => {
  // @ts-ignore
  const uo = await account.buildUserOperation({
    uo: {
      target,
      data,
      value: parseEther("0.00001"),
    }
  });
  return uo;
};

const EstimateGasFees: React.FC<EstimateGasFeesProps> = ({
  target,
  data,
}) => {
  const { account } = useAccountContext();
  const [uoBuilded, setuoBuilded] = useState<any>(null);
  const [isFetchButtonDisabled, setIsFetchButtonDisabled] = useState(false);

  if (target == "0x") {
    console.log("Please provide a target address");
    target = "0x784A0F24925F126dB2d33A4800230B371f8dee05"; // Default target for testing
  } else {
    console.log(
      "Building UserOperation with the following target:",
      target,
      "and callData:",
      data
    );
  }

  const fetchData = async () => {
    try {
      setIsFetchButtonDisabled(true);
      const uo = await buildUserOperation(account!, target, data);
      setuoBuilded(uo);
      console.log(uo);
    } catch (error) {
      console.error("Error building User Operation:", error);
    } finally {
      setIsFetchButtonDisabled(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  const preVerificationGas = uoBuilded && uoBuilded.preVerificationGas;
  const callGasLimit = uoBuilded && uoBuilded.callGasLimit;
  const verificationGasLimit = uoBuilded && uoBuilded.verificationGasLimit;
  const maxPriorityFeePerGas = uoBuilded && uoBuilded.maxPriorityFeePerGas;
  const maxFeePerGas = uoBuilded && uoBuilded.maxFeePerGas;
  const nonce = uoBuilded && uoBuilded.nonce;
  const initCode = uoBuilded && uoBuilded.initCode;
  const sender = uoBuilded && uoBuilded.sender;

  return (
    <View style={{ margin: 8 }}>
      <Text variant="labelLarge">
        Pre Verification Gas Estimated: {parseInt(preVerificationGas)}{" "}
      </Text>
      <Text variant="labelLarge">
        Call Gas Limit Estimated: {parseInt(callGasLimit)}{" "}
      </Text>
      <Text variant="labelLarge">
        Verification Gas Limit Estimated: {parseInt(verificationGasLimit)}{" "}
      </Text>
      <Text variant="labelLarge">
        Max Priority Fee Per Gas in gwei:{" "}
        {parseInt(maxPriorityFeePerGas) / 1000000000}{" "}
      </Text>
      <Text variant="labelLarge">
        Max Fee Per Gas in gwei: {parseInt(maxFeePerGas) / 1000000000}{" "}
      </Text>
    </View>
  );
};

export default EstimateGasFees;
