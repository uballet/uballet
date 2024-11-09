import { useEffect, useState } from "react";
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
  const [isInputValid, setIsInputValid] = useState(false);
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
    setIsInputValid(value != "")
  };

  useEffect(() => {
    if (isInputValid) {
      console.log(
        "Navigating to next screen... with address: ",
        resolvedAddress
      );
      navigateToNextScreen();
    }
  }, [resolvedAddress]);

  const handleInputEndEditing = async () => {    
    let isAddressInput = isAddress(input);
    console.log("isAddressInput: ", isAddressInput);
    var isInputValid = false;
    if (isAddressInput) {
      setInputType("address");
      isInputValid = validateAddress(input);
      if(isInputValid){
        setResolvedAddress(input);
      }
    } else {
      setInputType("ens");
      isInputValid = await handleResolveENS();
    }
    setIsInputValid(isInputValid);
  };

  const handleResolveENS = async () => {
    if (!input) return false;
    setIsResolving(true);
    var isInputValid = false
    try {
      const resolved = await resolveName(input);
      isInputValid = resolved != null;
      if(resolved){
        setResolvedAddress(resolved);
      } else {
        setResolvedAddress("");
      }
    } catch (error) {
      setIsInputValid(false);
      setResolvedAddress("");
    } finally {
      setIsENSResolved(true);
      setIsResolving(false);
    }
    return isInputValid
  };


  const navigateToNextScreen = () => {
    if (contactName != "") {
      console.log("Adding new contact...");
      addNewContact({ name: contactName, address: resolvedAddress });
    }
    router.push({
      pathname: "transfer/amount-and-currency",
      params: { toAddress: resolvedAddress },
    });
  };

  const isContactInputEnabled = () => {
    if (inputType === "address") {
      return isInputValid || input == "";
    } else {
      return isInputValid && (isENSResolved || isResolving);
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
            handleInputEndEditing={() => {}}
            isAddressValid={isContactInputEnabled()}
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
          onPress={handleInputEndEditing}
          disabled={input == ""}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

export default InputAddress;
