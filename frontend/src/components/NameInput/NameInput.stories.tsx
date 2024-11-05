import { Meta, StoryFn } from '@storybook/react';
import { View } from 'react-native';
import { default as ContactInput, default as NameInput } from './NameInput';

export default {
  title: 'NameInput',
  component: NameInput,
  decorators: [
    (Story) => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
} as Meta;

const Template: StoryFn<typeof NameInput> = (args) => <ContactInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: '',
  handleNameChange: (name: string) => console.log('Name changed:', name),
  helperText: 'Enter your name',
};
