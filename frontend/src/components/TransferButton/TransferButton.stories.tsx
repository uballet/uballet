import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Provider as PaperProvider } from "react-native-paper";
import TransferButton from "./TransferButton";
import { View } from "react-native";
import { theme } from "../../styles/color";

interface TransferButtonProps {
  currency: string;
  ethSymbol: string;
  loading: boolean;
  onTransferETH: () => void;
  onTransferToken: () => void;
}

export default {
  title: "TransferButton",
  component: TransferButton,
  decorators: [
    (Story) => (
      <PaperProvider theme={theme}>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </PaperProvider>
    ),
  ],
} as Meta;

const Template: StoryFn<TransferButtonProps> = (args) => <TransferButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  currency: "ETH",
  ethSymbol: "ETH",
  loading: false,
  onTransferETH: () => console.log("ETH transfer initiated"),
  onTransferToken: () => console.log("Token transfer initiated"),
};

export const Loading = Template.bind({});
Loading.args = {
  currency: "ETH",
  ethSymbol: "ETH",
  loading: true,
  onTransferETH: () => console.log("ETH transfer initiated"),
  onTransferToken: () => console.log("Token transfer initiated"),
};

export const TransferToken = Template.bind({});
TransferToken.args = {
  currency: "DAI",
  ethSymbol: "ETH",
  loading: false,
  onTransferETH: () => console.log("ETH transfer initiated"),
  onTransferToken: () => console.log("Token transfer initiated"),
};
