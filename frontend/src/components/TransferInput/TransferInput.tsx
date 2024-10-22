import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

interface TransferInputProps {
  amount: string;
  currency: string;
  currencies: string[];
  isAmountValid: boolean;
  handleAmountChange: (amount: string) => void;
  setCurrency: (currency: string) => void;
  testID?: string;
  currentBalance: string | null;
}

const TransferInput: React.FC<TransferInputProps> = ({
  amount,
  currency,
  currencies,
  isAmountValid,
  handleAmountChange,
  setCurrency,
  testID,
  currentBalance
}) => {
  const isAmountGreaterThanBalance = currentBalance !== null && parseFloat(amount) > parseFloat(currentBalance);

  return (
    <>
    <View style={styles.inputContainer}>
      <TextInput
        testID={testID}
        mode="flat"
        placeholder="0.0000"
        value={amount}
        onChangeText={handleAmountChange}
        style={styles.textInput}
        keyboardType="numeric"
        returnKeyType='done'
        error={!isAmountValid || isAmountGreaterThanBalance}
        placeholderTextColor="#888"
      />
      <Picker
        testID='transfer-input-picker'
        selectedValue={currency}
        style={styles.picker}
        onValueChange={(itemValue: string) => setCurrency(itemValue)}
      >
        {currencies.map((curr, index) => (
          <Picker.Item key={index} label={curr} value={curr} />
        ))}
      </Picker>
    </View>
    {!isAmountValid && amount !== '' && (parseFloat(amount) <= 0) && (
      <Text style={styles.errorText}>
        Amount must be greater than 0
      </Text>
    )}
    {isAmountGreaterThanBalance && (
      <Text style={styles.errorText}>
        Amount exceeds available balance
      </Text>
    )}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textInput: {
    margin: 8,
    flex: 1,
    fontSize: 24,
    backgroundColor: 'transparent',
  },
  picker: {
    width: 150,
  },
  errorText: {
    color: "red",
    marginLeft: 8,
  },
});

export default TransferInput;
