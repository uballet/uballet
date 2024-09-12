import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
  } from "react-native";
import { useState, useEffect } from "react";
import styles from "../../../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
  
interface ERC20Token {
    symbol: string;
    name: string;
    address: string;
}
  
const ImportTokenScreen = () => {
    const [contractAddress, setContractAddress] = useState("");
    const { getUserTokens } = useBlockchainContext();
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
  
    const handleAddToken = () => {
      if (contractAddress.trim()) {
        console.log("ERC20 Contract Address:", contractAddress);
        const newToken: ERC20Token = {
          symbol: "NEW",
          name: "New Token",
          address: contractAddress,
        };
        setCustomTokens([...customTokens, newToken]);
        setContractAddress(""); // Clear the input
      } else {
        console.log("Please enter a valid contract address");
      }
    };
  
    const handleRemoveToken = (tokenAddress: string) => {
      const updatedTokens = customTokens.filter(
        (token) => token.address !== tokenAddress
      );
      setCustomTokens(updatedTokens);
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
  