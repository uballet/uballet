import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import AssetsAllocationChart from "./AssetsAllocationChart";
import { View } from "react-native";

const useTokenInfoMock = (
  // @ts-ignore
  data,
  loading = false,
  error: string | null = null
) => {
  return {
    data,
    loading,
    error,
  };
};

const mockData = {
  ETH: {
    balance: 1.5,
    balanceInUSDT: 1500,
    quote: 1000,
  },
  DAI: {
    balance: 100,
    balanceInUSDT: 100,
    quote: 1,
  },
};

const emptyData = {};

const AssetsAllocationChartMeta: Meta<typeof AssetsAllocationChart> = {
  title: "AssetsAllocationChart",
  component: AssetsAllocationChart,
  decorators: [
    (Story) => (
      <View style={{ padding: 20 }}>
        <Story />
      </View>
    ),
  ],
};

export default AssetsAllocationChartMeta;

type Story = StoryObj<typeof AssetsAllocationChart>;

// Default story with mock data
export const Default: Story = {
  render: () => {
    require("../../hooks/useTokenInfo").useTokenInfo = () =>
      useTokenInfoMock(mockData);
    return <AssetsAllocationChart />;
  },
  name: "Default",
};

// Story for loading state
export const Loading: Story = {
  render: () => {
    require("../../hooks/useTokenInfo").useTokenInfo = () =>
      useTokenInfoMock(null, true);
    return <AssetsAllocationChart />;
  },
  name: "Loading State",
};

// Story for error state
export const ErrorState: Story = {
  render: () => {
    require("../../hooks/useTokenInfo").useTokenInfo = () =>
      useTokenInfoMock(null, false, "Error fetching data");
    return <AssetsAllocationChart />;
  },
  name: "Error State",
};

// Story with no balances
export const NoBalances: Story = {
  render: () => {
    require("../../hooks/useTokenInfo").useTokenInfo = () =>
      useTokenInfoMock(emptyData);
    return <AssetsAllocationChart />;
  },
  name: "No Balances",
};
