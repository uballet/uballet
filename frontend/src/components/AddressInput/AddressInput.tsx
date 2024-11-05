import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface AddressInputProps {
  input: string;
  handleInputChange: (value: string) => void;
  isInputValid: boolean;
  placeholder: string;
  resolvedAddress?: string;
}

const AddressInput: React.FC<AddressInputProps> = ({
  input,
  handleInputChange,
  isInputValid,
  placeholder
}) => {
  return (
    <View>
      <TextInput
        mode="outlined"
        style={styles.input}
        placeholder={placeholder}
        value={input}
        onChangeText={handleInputChange}
        error={!isInputValid}
      />
      {!isInputValid && (
        <Text style={styles.errorText}>Invalid ENS name</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
  },
  errorText: {
    color: 'red',
    marginLeft: 8,
  },
  resolvedText: {
    marginLeft: 8,
    marginTop: 4,
  },
});

export default AddressInput;
