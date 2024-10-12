import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import UserInfo from "./UserInfo";
import { View } from "react-native";

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
  },
};

export const ContractDeployedFalse: Story = {
  args: {
    email: "user@example.com",
    contractDeployed: false,
  },
};
