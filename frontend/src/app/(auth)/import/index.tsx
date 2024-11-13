import { useState, useEffect } from "react";
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
import { useERC20 } from "../../../hooks/useERC20";
import { theme } from "../../../styles/color";

interface ERC20Token {
  symbol: string;
  name: string;
  address: string;
}

const ImportTokenScreen = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(true);
  const { getUserTokens, addUserToken, removeUserToken } =
    useBlockchainContext();
  const [customTokens, setCustomTokens] = useState<ERC20Token[]>([]);
  const { isERC20Contract, getERC20Name, getERC20Symbol } = useERC20();

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
    if (
      contractAddress.startsWith("0x") &&
      ethers.isAddress(contractAddress.trim())
    ) {
      const isERC20 = await isERC20Contract(contractAddress);

      const tokenExists = customTokens.some(
        (token) =>
          token.address.toLowerCase() === contractAddress.trim().toLowerCase()
      );

      if (tokenExists) {
        console.log("Token already added");
        return;
      }

      if (!isERC20) {
        setIsAddressValid(false);
        console.log("Please enter a valid contract address");
      }

      const name = await getERC20Name(contractAddress);
      const symbol = await getERC20Symbol(contractAddress);

      const newToken: ERC20Token = {
        symbol: symbol,
        name: name,
        address: contractAddress,
      };

      setCustomTokens((prevTokens) => [...prevTokens, newToken]);

      try {
        await addUserToken(newToken);
      } catch (error) {
        setCustomTokens((prevTokens) =>
          prevTokens.filter((token) => token.address !== contractAddress)
        );
      } finally {
        setContractAddress("");
      }
    } else {
      setIsAddressValid(false);
      console.log("Please enter a valid contract address");
    }
  };

  const handleRemoveToken = async (tokenAddress: string) => {
    setCustomTokens((prevTokens) =>
      prevTokens.filter((token) => token.address !== tokenAddress)
    );

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
        <View className="bg-gray-100 p-4">
          <View className="bg-yellow-100 p-3 rounded-md mb-4 flex-row items-center">
            <Ionicons
              name="warning-outline"
              size={20}
              color="black"
              className="mr-2"
            />
            <View className="flex-1 ml-3">
              <Text className="text-black text-sm">
                Anyone can create a token, including fake versions of existing
                tokens.
              </Text>
            </View>
          </View>

          <TextInput
            testID="token-contract-address-input"
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
            testID="add-token-button"
            style={{ ...styles.button, backgroundColor: theme.colors.primary }}
            onPress={handleAddToken}
            className="p-3 rounded-md"
          >
            <Text className="text-white text-center font-bold">Add Token</Text>
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
                  The address you provided is not a valid Ethereum address, or
                  it is no the address of an ERC20 contract.
                </Text>
              </View>
            </View>
          )}

          {customTokens.length > 0 && (
            <View className="mt-0 bg-white p-4 rounded-lg shadow">
              <Text className="text-sm font-semibold mb-4 text-black">
                Imported Tokens:
              </Text>
              {customTokens.map((token, index) => (
                <View
                  testID={"custom-token-" + token.symbol}
                  key={index}
                  className="flex-row justify-between items-center bg-gray-100 p-3 mb-2 rounded-md"
                >
                  <View>
                    <Text className="text-black font-semibold">
                      {token.symbol}
                    </Text>
                    <Text className="text-gray-600 text-xs">
                      {token.address}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveToken(token.address)}
                  >
                    <Ionicons name="trash-outline" size={20} color="black" />
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
