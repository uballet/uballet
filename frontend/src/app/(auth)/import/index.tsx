import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "../../../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import { ethers } from "ethers";

interface ERC20Token {
  symbol: string;
  name: string;
  address: string;
}

const ImportTokenScreen = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(true);
  const { getUserTokens, addUserToken, removeUserToken } = useBlockchainContext();
  const [customTokens, setCustomTokens] = useState<ERC20Token[]>([]);

  useEffect(() => {
    const fetchTokens = async () => {
        try {
            const tokens = await getUserTokens(); 
            setCustomTokens(tokens);
        } catch (error) {
            console.error("Failed to fetch tokens:", error);
      }
    };

    fetchTokens();
  }, [getUserTokens]);

  const handleAddToken = async () => {
    if (contractAddress.startsWith("0x") && ethers.isAddress(contractAddress.trim())) {
        const newToken: ERC20Token = {
        symbol: "NEW",
        name: "New Token",
        address: contractAddress,
        };

        setCustomTokens((prevTokens) => [...prevTokens, newToken]);

        try {
        await addUserToken(newToken);
        } catch (error) {
        setCustomTokens((prevTokens) => prevTokens.filter(token => token.address !== contractAddress));
        } finally {
        setContractAddress("");
        }
    } else {
        setIsAddressValid(false);
        console.log("Please enter a valid contract address");
    }
  };

  const handleRemoveToken = async (tokenAddress: string) => {
    setCustomTokens((prevTokens) => prevTokens.filter(token => token.address !== tokenAddress));

    try {
        await removeUserToken(tokenAddress);
    } catch (error) {
        console.error("Failed to remove token:", error);
        const tokenToRestore: ERC20Token = {
        symbol: "NEW",
        name: "New Token",
        address: tokenAddress,
        };
        setCustomTokens((prevTokens) => [...prevTokens, tokenToRestore]);
    }
  };

  return (
    <SafeAreaView className="w-full flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-gray-100 p-6">
          <View className="bg-yellow-100 p-3 rounded-md mb-4 flex-row items-center">
            <Ionicons
              name="warning-outline"
              size={20}
              color="black"
              className="mr-2"
            />
            <View className="flex-1">
              <Text className="text-black text-sm">
                Anyone can create a token, including fake versions of existing
                tokens.
              </Text>
            </View>
          </View>

          <TextInput
            style={{
              backgroundColor: "white",
              borderColor: "gray",
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
            }}
            placeholder="Enter token contract address"
            placeholderTextColor="gray"
            value={contractAddress}
            onChangeText={(text) => setContractAddress(text)}
          />

          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "black", marginTop: 15 }}
            onPress={handleAddToken}
            className="p-3 rounded-md"
          >
            <Text className="text-white text-center font-medium">Add Token</Text>
          </TouchableOpacity>

          {!isAddressValid && (
            <View className="bg-red-100 p-3 rounded-md mb-4 flex-row items-center">
              <Ionicons
                name="close-circle-outline"
                size={20}
                color="black"
                className="mr-2"
              />
              <View className="flex-1">
                <Text className="text-black text-sm">
                  The address you provided is not a valid Ethereum address
                </Text>
              </View>
            </View>
          )}

          {customTokens.length > 0 && (
            <View className="mt-6 bg-white p-4 rounded-lg shadow">
              <Text className="text-lg font-semibold mb-4 text-black">
                Imported Tokens:
              </Text>
              {customTokens.map((token, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center bg-gray-100 p-3 mb-2 rounded-md"
                >
                  <View>
                    <Text className="text-black font-semibold">{token.symbol}</Text>
                    <Text className="text-black">{token.name}</Text>
                    <Text className="text-gray-600 text-xs">{token.address}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveToken(token.address)}
                    className="ml-4"
                  >
                    <Ionicons name="close" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImportTokenScreen;
