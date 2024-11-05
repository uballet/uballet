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
    style={styles.margin}
    placeholder={helperText}
    value={name}
    onChangeText={handleNameChange}
  />
);

const styles = StyleSheet.create({
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  margin: {
    marginVertical: 8,
  },
});

export default NameInput;
