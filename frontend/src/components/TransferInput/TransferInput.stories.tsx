import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import TransferInput from './TransferInput';
import { View } from 'react-native';

interface TransferInputProps {
    amount: string;
    currency: string;
    currencies: string[];
    isAmountValid: boolean;
    handleAmountChange: (amount: string) => void;
    setCurrency: (currency: string) => void;
    currentBalance: string;
}

export default {
  title: 'TransferInput',
  component: TransferInput,
  decorators: [
    (Story) => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
} as Meta;

const Template: StoryFn<TransferInputProps> = (args) => <TransferInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  amount: '0.1234',
  currency: 'ETH',
  currencies: ['ETH', 'DAI', 'USDC'],
  isAmountValid: true,
  handleAmountChange: (amount: string) => console.log('Amount changed:', amount),
  setCurrency: (currency: string) => console.log('Currency selected:', currency),
  currentBalance: '1.5',
};

export const InvalidAmount = Template.bind({});
InvalidAmount.args = {
  amount: '',
  currency: 'ETH',
  currencies: ['ETH', 'DAI', 'USDC'],
  isAmountValid: false,
  handleAmountChange: (amount: string) => console.log('Amount changed:', amount),
  setCurrency: (currency: string) => console.log('Currency selected:', currency),
  currentBalance: '1.5',
};
