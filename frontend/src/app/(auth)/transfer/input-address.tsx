import { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { router } from "expo-router";
import { ethers } from "ethers";
import styles from "../../../styles/styles";
import ContactInput from "../../../components/ContactInput/ContactInput";
import { theme } from "../../../styles/color";
import { useENS } from "../../../hooks/useENS";
import NameInput from "../../../components/NameInput/NameInput";
import { useAddContact } from "../../../hooks/contacts/useAddContact";

function InputAddress() {
  const [input, setInput] = useState("");
  const [contactName, setContactName] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const [inputType, setInputType] = useState<"address" | "ens">("address");
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [isENSResolved, setIsENSResolved] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const { addNewContact, isSuccess } = useAddContact();
  const { resolveName } = useENS();

  const isAddress = (value: string) => {
    return value.startsWith("0x");
  };
  const validateAddress = (value: string) => {
    const fullAddress = value.startsWith("0x") ? value : `0x${value}`;
    const isValid = ethers.isAddress(fullAddress);
    return isValid;
  };

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleInputEndEditing = () => {
    if (!input || input === "") {
      setIsInputValid(true);
      return;
    }
    let isAddressInput = isAddress(input);
    if (isAddressInput) {
      setInputType("address");
      let isValidAddress = validateAddress(input);
      setIsInputValid(isValidAddress);
    } else {
      setInputType("ens");
      setIsENSResolved(false);
      handleResolveENS();
    }
  };

  const handleResolveENS = async () => {
    if (!input) return;
    setIsResolving(true);
    try {
      const resolved = await resolveName(input);
      setIsInputValid(!!resolved);
      setResolvedAddress(resolved || "");
      setIsENSResolved(!!resolved);
    } catch (error) {
      setIsInputValid(false);
      setResolvedAddress("");
      setIsENSResolved(false);
    } finally {
      setIsResolving(false);
    }
  };

  const handleNext = () => {
    if (contactName != "") {
      console.log("Adding new contact...");
      addNewContact({ name: contactName, address: resolvedAddress });
    }
    router.push({
      pathname: "transfer/amount-and-currency",
      params: { toAddress: resolvedAddress },
    });
  };

  const isNextButtonDisabled = () => {
    if (inputType === "address") {
      return !isInputValid || !input;
    } else {
      return !isENSResolved || !resolvedAddress;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View style={{ width: "100%", paddingHorizontal: 20 }}>
          <Text style={styles.infoText}>
            Enter a name to save this address as a contact
          </Text>
          <NameInput
            helperText="Name (optional)"
            testID="transfer-contact-name-input"
            name={contactName}
            handleNameChange={setContactName}
          />
          <Text style={styles.infoText}>Enter an address or ENS name</Text>
          <ContactInput
            testID="transfer-address-input"
            toAddress={resolvedAddress}
            isResolving={isResolving}
            handleAddressChange={handleInputChange}
            handleInputEndEditing={handleInputEndEditing}
            isAddressValid={isInputValid || input == ""}
            inputType={inputType}
          />
        </View>
      </View>

      <View
        style={{
          paddingBottom: 20,
          alignItems: "center",
          marginHorizontal: 16,
        }}
      >
        <Button
          mode="outlined"
          style={[styles.button, { alignSelf: "center", marginTop: 16 }]}
          onPress={() => router.push({ pathname: "scanner" })}
        >
          Scan QR
        </Button>

        <Button
          testID="input-address-next-button"
          style={styles.button}
          mode="contained"
          onPress={handleNext}
          disabled={isNextButtonDisabled()}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

export default InputAddress;
