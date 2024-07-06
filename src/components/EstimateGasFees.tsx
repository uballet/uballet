import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

interface EstimateGasFeesProps {
  apiUrl: string; // URL of the API endpoint
}

const EstimateGasFees: React.FC<EstimateGasFeesProps> = ({ apiUrl }) => {
  const [responseData, setResponseData] = useState<any>(null); // State to hold the fetched data

  const fetchData = async () => {
    try {
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
          "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
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
      setResponseData(data); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  const preVerificationGas: string =
    responseData && responseData.result.preVerificationGas;
  const callGasLimit: string = responseData && responseData.result.callGasLimit;
  const verificationGasLimit: string =
    responseData && responseData.result.verificationGasLimit;
  return (
    <View>
      <Text>
        Pre Verification Gas Estimated: {parseInt(preVerificationGas)}{" "}
      </Text>
      <Text>Call Gas Limit Estimated: {parseInt(callGasLimit)} </Text>
      <Text>
        Verification Gas Limit Estimated: {parseInt(verificationGasLimit)}{" "}
      </Text>
      <Button title="Fetch Data Again" onPress={fetchData} />
    </View>
  );
};

export default EstimateGasFees;
