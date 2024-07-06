import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

interface EstimateGasFeesProps {
  apiUrl: string; // URL of the API endpoint
}

const getNonce = async () => {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(
      "https://eth-sepolia.g.alchemy.com/v2/TID2J0HPVvfYlp1TCsXE3ysXmVYOcpjf"
    ),
  });

  const address = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // EntryPoint Address 0.6.0 for Sepolia
  const abi = [
    {
      inputs: [
        { name: "sender", type: "address" },
        { name: "key", type: "uint192" },
      ],
      name: "getNonce",
      outputs: [{ name: "nonce", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ]; // ABI for getNonce function
  const functionName = "getNonce";
  const args = ["0x90c4B98A974eE144d77AE427972DD4A85Ac11E25", 0];

  const response = await publicClient.readContract({
    address,
    abi,
    functionName,
    args,
  });

  console.log("Obtained nonce from entry point:", response);
};

const getMaxPriorityFeePerGas = async () => {
  const url =
    "https://eth-sepolia.g.alchemy.com/v2/TID2J0HPVvfYlp1TCsXE3ysXmVYOcpjf";
  const headers = {
    "Content-Type": "application/json",
  };
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "rundler_maxPriorityFeePerGas", // defined here https://docs.alchemy.com/reference/eth-estimateuseroperationgas
    params: [],
  };
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorResponse = await response.json(); // Parse error response
    console.error("Error:", errorResponse); // Log error message from the server
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log("Max Priority Fee Per Gas:", data); // Log the fetched data

  return data;
};

const getEstimateUserOperationGas = async () => {
  const url =
    "https://eth-sepolia.g.alchemy.com/v2/TID2J0HPVvfYlp1TCsXE3ysXmVYOcpjf";
  const headers = {
    "Content-Type": "application/json",
  };
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_estimateUserOperationGas", // defined here https://docs.alchemy.com/reference/eth-estimateuseroperationgas
    params: [
      {
        sender: "0x90c4B98A974eE144d77AE427972DD4A85Ac11E25", // smart account address
        nonce: "0x2", // nonce has to be obtained from entry point
        initCode: "0x", // 0x if contract already deployed, else set the init code
        // Encode call data https://docs.chainstack.com/recipes/how-to-encode-calldata-parameters-to-programmatically-interact-with-a-smart-contract or https://docs.stackup.sh/docs/useroperation-calldata
        callData:
          "0xb61d27f6000000000000000000000000784a0f24925f126db2d33a4800230b371f8dee0500000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000", // encoded ABI for smart contract call
        signature:
          "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c", // dummy signature
        paymasterAndData: "0x", // 0x if no paymaster, check what happens if paymaster is set
      },
      "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // EntryPoint Address 0.6.0 for Sepolia
    ],
  };
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorResponse = await response.json(); // Parse error response
    console.error("Error:", errorResponse); // Log error message from the server
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log("Estimate User Operation Gas:", data); // Log the fetched data

  return data;
};

const EstimateGasFees: React.FC<EstimateGasFeesProps> = ({ apiUrl }) => {
  const [maxPriorityFeePerGasData, setMaxPriorityFeePerGasData] =
    useState<any>(null);
  const [estimateUserOperationGasData, setEstimateUserOperationGasData] =
    useState<any>(null);

  const fetchData = async () => {
    try {
      const nonce = await getNonce(); // For now we are not using this nonce beacuse we are hardcoding the nonce in getEstimateUserOperationGas
      const maxPriorityFeePerGas = await getMaxPriorityFeePerGas();
      const estimateUserOperationGas = await getEstimateUserOperationGas();

      setMaxPriorityFeePerGasData(maxPriorityFeePerGas);
      setEstimateUserOperationGasData(estimateUserOperationGas);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  const preVerificationGas: string =
    estimateUserOperationGasData &&
    estimateUserOperationGasData.result.preVerificationGas;
  const callGasLimit: string =
    estimateUserOperationGasData &&
    estimateUserOperationGasData.result.callGasLimit;
  const verificationGasLimit: string =
    estimateUserOperationGasData &&
    estimateUserOperationGasData.result.verificationGasLimit;
  const maxPriorityFeePerGas: string =
    maxPriorityFeePerGasData && maxPriorityFeePerGasData.result;
  return (
    <View>
      <Text>
        Pre Verification Gas Estimated: {parseInt(preVerificationGas)}{" "}
      </Text>
      <Text>Call Gas Limit Estimated: {parseInt(callGasLimit)} </Text>
      <Text>
        Verification Gas Limit Estimated: {parseInt(verificationGasLimit)}{" "}
      </Text>
      <Text>
        Max Priority Fee Per Gas in wei: {parseInt(maxPriorityFeePerGas)}{" "}
      </Text>
      <Button title="Fetch Data Again" onPress={fetchData} />
    </View>
  );
};

export default EstimateGasFees;
