import React from "react";
import {
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
  View,
} from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import styles from "../../styles/styles";

interface ContactInputProps {
  handleAddressChange: (address: string) => void;
  handleInputEndEditing: (
    event: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => void;
  toAddress: string;
  isResolving: boolean;
  isAddressValid: boolean;
  inputType: string;
  testID?: string;
}

const ContactInput: React.FC<ContactInputProps> = ({
  handleAddressChange,
  handleInputEndEditing,
  toAddress,
  isResolving,
  isAddressValid,
  inputType,
  testID,
}) => {
  return (
    <>
      <TextInput
        testID={testID}
        mode="outlined"
        style={{
          backgroundColor: "white",
          borderColor: "gray",
          borderWidth: 0,
          marginVertical: 8,
        }}
        placeholder="Address or ENS name"
        onChangeText={handleAddressChange}
        onEndEditing={handleInputEndEditing}
        error={!isAddressValid}
        autoCapitalize="none"
      />
      {!isAddressValid && (
        <Text style={styles.errorText}>
          {inputType === "address" ? "Invalid address" : "Invalid ENS name"}
        </Text>
      )}
      {
        <Text style={styles.infoText}>
          {inputType === "ens" && isAddressValid && toAddress !== ""
            ? "Address resolved: " + toAddress
            : ""}
        </Text>
      }
      {isResolving && (
        <View>
          <Text style={styles.infoText} className="mb-4">
            Resolving Address...
          </Text>
          <ActivityIndicator testID="activity-indicator" />
        </View>
      )}
    </>
  );
};

export default ContactInput;
