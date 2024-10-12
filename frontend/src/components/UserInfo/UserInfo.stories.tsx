import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import UserInfo from "./UserInfo";
import { View } from "react-native";

const SOME_ADDRESS = "0x3fE98C2F9C7D2aF4B5e2dFbFd146579E6F4D58F2";

const UserInfoMeta: Meta<typeof UserInfo> = {
  title: "UserInfo",
  component: UserInfo,
  decorators: [
    (Story) => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
};

export default UserInfoMeta;

type Story = StoryObj<typeof UserInfoMeta>;

export const ContractDeployedTrue: Story = {
  args: {
    email: "user@example.com",
    contractDeployed: true,
    publicAddress: SOME_ADDRESS
  },
};

export const ContractDeployedFalse: Story = {
  args: {
    email: "user@example.com",
    contractDeployed: false,
    publicAddress: SOME_ADDRESS
  },
};
