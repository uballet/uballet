import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";

interface NameInputProps {
  name: string;
  handleNameChange: (name: string) => void;
  helperText?: string;
  testID?: string;
}

const NameInput: React.FC<NameInputProps> = ({
  name,
  handleNameChange,
  helperText,
  testID,
}) => (
  <TextInput
    testID={testID}
    mode="outlined"
    style={{
      backgroundColor: "white",
      borderColor: "gray",
      borderWidth: 0,
    }}
    placeholder={helperText}
    value={name}
    onChangeText={handleNameChange}
    autoCapitalize="none"
  />
);

export default NameInput;
