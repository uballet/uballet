import React from "react";
import {
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
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
        style={styles.margin}
        placeholder="Address or ENS name"
        onChangeText={handleAddressChange}
        onEndEditing={handleInputEndEditing}
        error={!isAddressValid}
      />
      {!isAddressValid && (
        <Text style={styles.errorText}>
          {inputType === "address" ? "Invalid address" : "Invalid ENS name"}
        </Text>
      )}
      {
        <Text style={styles.infoText}>
          {inputType === "ens" && isAddressValid
            ? "Address resolved: " + toAddress
            : ""}
        </Text>
      }
      {isResolving && <ActivityIndicator testID="activity-indicator"/>}
    </>
  );
};

export default ContactInput;
