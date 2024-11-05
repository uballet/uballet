import { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Text, SegmentedButtons, TextInput } from "react-native-paper";
import { router } from "expo-router";
import { ethers } from "ethers";
import styles from "../../../styles/styles";
import ContactInput from "../../../components/ContactInput/ContactInput";
import AddressInput from "../../../components/AddressInput/AddressInput";
import { theme } from "../../../styles/color";
import { useENS } from "../../../hooks/useENS";
import { SafeAreaView } from "react-native-safe-area-context";
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

  useEffect(() => {
    if (inputType === "address") {
      validateAddress(input);
    }
  }, [input, inputType]);

  const validateAddress = (value: string) => {
    const fullAddress = value.startsWith("0x") ? value : `0x${value}`;
    const isValid = ethers.isAddress(fullAddress);
    setIsInputValid(isValid);
    setResolvedAddress(isValid ? fullAddress : "");
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (inputType === "ens") {
      setIsENSResolved(false);
      setIsInputValid(true);
      setResolvedAddress("");
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
          <Text style={styles.infoText}>Enter an address or ENS name</Text>

          <SegmentedButtons
            value={inputType}
            onValueChange={(value) => {
              setInputType(value as "address" | "ens");
              setInput("");
              setIsInputValid(true);
              setResolvedAddress("");
              setIsENSResolved(false);
            }}
            buttons={[
              { value: "address", label: "Address" },
              { value: "ens", label: "ENS Name" },
            ]}
            style={{ marginBottom: 16 }}
          />

          <NameInput
            helperText="Add name to save this contact (optional)"
            testID="transfer-contact-name-input"
            name={contactName}
            handleNameChange={setContactName}
          />

          {inputType === "address" ? (
            <ContactInput
              testID="transfer-address-input"
              toAddress={input}
              handleAddressChange={handleInputChange}
              isAddressValid={isInputValid || input == ""}
            />
          ) : (
            <View>
              <AddressInput
                input={input}
                handleInputChange={handleInputChange}
                isInputValid={isInputValid}
                placeholder="Enter ENS name"
              />
              {resolvedAddress && <Text style={styles.infoText}>Address resolved: {resolvedAddress}</Text> }
              <Button
                mode="contained"
                onPress={handleResolveENS}
                disabled={!input || isResolving}
                style={[
                  { marginTop: 8 },
                  isENSResolved && { backgroundColor: theme.colors.success },
                ]}
              >
                {isResolving
                  ? "Resolving..."
                  : isENSResolved
                  ? "Resolved"
                  : "Resolve ENS"}
              </Button>
            </View>
          )}
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
