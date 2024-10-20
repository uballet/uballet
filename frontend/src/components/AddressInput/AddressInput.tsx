import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface AddressInputProps {
  input: string;
  handleInputChange: (value: string) => void;
  isInputValid: boolean;
  inputType: 'address' | 'ens';
  placeholder: string;
}

const AddressInput: React.FC<AddressInputProps> = ({
  input,
  handleInputChange,
  isInputValid,
  inputType,
  placeholder,
}) => {
  return (
    <View>
      <TextInput
        mode="outlined"
        style={styles.input}
        placeholder={placeholder}
        value={input}
        left={inputType === 'address' ? <TextInput.Affix text="0x" /> : null}
        onChangeText={handleInputChange}
        error={!isInputValid}
      />
      {!isInputValid && (
        <Text style={styles.errorText}>
          {inputType === 'address' ? 'Invalid Ethereum address' : 'Invalid ENS name'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 8,
  },
  errorText: {
    color: 'red',
    marginLeft: 8,
  },
});

export default AddressInput;