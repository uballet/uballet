import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import ContactInput from './ContactInput';
import { View } from 'react-native';

export default {
  title: 'ContactInput',
  component: ContactInput,
  decorators: [
    (Story) => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
} as Meta;

const Template: StoryFn<typeof ContactInput> = (args) => <ContactInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  toAddress: '',
  handleAddressChange: (address: string) => console.log('Address changed:', address),
  isAddressValid: true,
};

export const InvalidAddress = Template.bind({});
InvalidAddress.args = {
  toAddress: 'invalidaddress',
  handleAddressChange: (address: string) => console.log('Address changed:', address),
  isAddressValid: false,
};

export const FilledAddress = Template.bind({});
FilledAddress.args = {
  toAddress: '0xD50a356D31857636d96Ebe500F51835FB04E6B08',
  handleAddressChange: (address: string) => console.log('Address changed:', address),
  isAddressValid: true,
};