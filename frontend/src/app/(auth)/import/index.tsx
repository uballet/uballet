import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
  } from "react-native";
  import { useState } from "react";
  import styles from "../../../styles/styles";
  import { Ionicons } from "@expo/vector-icons";
  

  const ImportTokenScreen = () => {
    // TODO: Get from config
    const [contractAddress, setContractAddress] = useState("");
    const [customTokens, setCustomTokens] = useState([
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      {
        symbol: "DAI",
        name: "Dai Stablecoin",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      },
    ]);
  
    // TODO: handle adding the ERC20 token
    const handleAddToken = () => {
      if (contractAddress.trim()) {
        console.log("ERC20 Contract Address:", contractAddress);
        // TODO: add logic to fetch token details by contract address, then add to customTokens
        const newToken = {
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
  
    // TODO: remove token
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
            <Text className="text-lg font-semibold mb-4 text-black p-1">
              Import ERC-20 Token by Contract Address:
            </Text>
  
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
  