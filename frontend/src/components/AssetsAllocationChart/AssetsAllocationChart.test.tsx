import React from "react";
import { render, screen } from "@testing-library/react-native";
import AssetsAllocationChart from "./AssetsAllocationChart";

// Mocking the internal implementation of the hook to avoid importing dependencies like Alchemy
jest.mock("../../hooks/useTokenInfo", () => ({
  useTokenInfo: jest.fn(),
}));

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

const renderComponent = () => {
  return render(<AssetsAllocationChart />);
};

describe("AssetsAllocationChart Component", () => {
  const useTokenInfo = require("../../hooks/useTokenInfo").useTokenInfo;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading state", () => {
    useTokenInfo.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    renderComponent();

    expect(screen.getByTestId("ActivityIndicator")).toBeTruthy();
  });

  it("displays error state", () => {
    useTokenInfo.mockReturnValue({
      data: null,
      loading: false,
      error: "Error fetching data",
    });

    renderComponent();

    expect(screen.getByText("Error: no data available")).toBeTruthy();
  });

  it("displays chart when data is available", () => {
    useTokenInfo.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    renderComponent();

    expect(screen.getByTestId("assets-allocation-pie-chart")).toBeTruthy();
  });

  it('displays "No balances to show" when no data is available', () => {
    useTokenInfo.mockReturnValue({
      data: {},
      loading: false,
      error: null,
    });

    renderComponent();

    expect(
      screen.getByText("No balances to show! Try adding tokens to your wallet")
    ).toBeTruthy();
  });
});
