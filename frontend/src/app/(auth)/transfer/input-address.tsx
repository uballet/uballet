import { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { router } from "expo-router";
import { ethers } from "ethers";
import styles from "../../../styles/styles";
import ContactInput from "../../../components/ContactInput/ContactInput";
import { theme } from "../../../styles/color"

function InputAddress() {
  const [toAddress, setAddress] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(true);

  const handleAddressChange = (address: string) => {
    const fullAddress = `0x${address}`;
    setAddress(address);
    setIsAddressValid(ethers.isAddress(fullAddress));
  };

  const handleNext = () => {
    router.push({
      pathname: "transfer/amount-and-currency",
      params: { toAddress: `0x${toAddress}` },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '100%', paddingHorizontal: 20 }}>
            <Text style={ styles.infoText }> Enter an address</Text>

            {/* Address Input */}
            <ContactInput
                toAddress={toAddress}
                handleAddressChange={handleAddressChange}
                isAddressValid={isAddressValid}
            />

            {/* Scan QR */}
            <Button
                mode="outlined"
                style={[styles.button, { width: 200, alignSelf: 'center', marginTop: 16 }]}
                onPress={() => router.push({ pathname: "scanner" })}
            >
                Scan QR
            </Button>
        </View>
      </View>

      {/* Next Button */}
      <View style={{ paddingBottom: 20, alignItems: 'center' }}>
        <Button
          style={[styles.button, { width: 200 }]}
          mode="contained"
          onPress={handleNext}
          disabled={!isAddressValid || !toAddress}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

export default InputAddress;
