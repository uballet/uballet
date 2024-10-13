import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import EstimateGasFees from "./EstimateGasFees";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View } from "react-native";

const mockClient = {
    buildUserOperation: async () => ({
      preVerificationGas: "21000",
      callGasLimit: "21000",
      verificationGasLimit: "21000",
      maxPriorityFeePerGas: "2000000000",
      maxFeePerGas: "2000000000",
      nonce: "0x1",
      initCode: "0xabcdef",
      sender: "0x1234567890abcdef1234567890abcdef12345678",
    }),
};

const mockClientNoData = {
    buildUserOperation: async () => ({
      preVerificationGas: "",
      callGasLimit: "",
      verificationGasLimit: "",
      maxPriorityFeePerGas: "",
      maxFeePerGas: "",
      nonce: "",
      initCode: "",
      sender: "",
    }),
};
  
const mockAccount = {
getEntryPoint: () => "0xEntryPointAddress",
};
  

const queryClient = new QueryClient();

const EstimateGasFeesMeta: Meta<typeof EstimateGasFees> = {
  title: "EstimateGasFees",
  component: EstimateGasFees,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </QueryClientProvider>
    ),
  ],
};

export default EstimateGasFeesMeta;

type Story = StoryObj<typeof EstimateGasFeesMeta>;

export const Default: Story = {
  args: {
    // @ts-ignore
    client: mockClient,
    // @ts-ignore
    account: mockAccount,
    target: "0xabcdef1234567890abcdef1234567890abcdef12",
    data: "0x123456",
  },
};

export const Loading: Story = {
    args: {
        // @ts-ignore
        client: {
            buildUserOperation: async () =>
                new Promise((resolve) =>
                setTimeout(
                    () =>   
                        resolve({
                            // @ts-ignore
                            preVerificationGas: "21000",
                            // @ts-ignore
                            callGasLimit: "21000",
                            // @ts-ignore
                            verificationGasLimit: "21000",
                            // @ts-ignore
                            maxPriorityFeePerGas: "2000000000",
                            // @ts-ignore
                            maxFeePerGas: "2000000000",
                            nonce: "0x1",
                            initCode: "0xabcdef",
                            sender: "0x1234567890abcdef1234567890abcdef12345678",
                    }),
                2000 // Simulates a loading delay
            )
          ),
      },
      // @ts-ignore
      account: mockAccount,
      target: "0xabcdef1234567890abcdef1234567890abcdef12",
      data: "0x123456",
    },
  };
  

export const NoData: Story = {
  args: {
    // @ts-ignore
    client: mockClientNoData,
    // @ts-ignore
    account: mockAccount,
    target: "0xabcdef1234567890abcdef1234567890abcdef12",
    data: "0x",
  },
};
