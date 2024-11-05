import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

interface ContactInputProps {
  toAddress: string;
  handleAddressChange: (address: string) => void;
  isAddressValid: boolean;
  testID?: string;
}

const ContactInput: React.FC<ContactInputProps> = ({
  toAddress,
  handleAddressChange,
  isAddressValid,
  testID
}) => {
  return (
    <>
      <TextInput
        testID={testID}
        mode="outlined"
        style={styles.margin}
        placeholder="Address without 0x prefix"
        value={toAddress}
        left={<TextInput.Affix text="0x" />}
        onChangeText={handleAddressChange}
        error={!isAddressValid}
      />
      {!isAddressValid && (
        <Text style={styles.errorText}>
          Invalid Ethereum address
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  margin: {
    marginVertical: 8,
  },
  errorText: {
    color: 'red',
    marginLeft: 8,
  },
});

export default ContactInput;
