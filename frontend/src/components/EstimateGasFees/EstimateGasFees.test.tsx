import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import EstimateGasFees from './EstimateGasFees';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const renderComponent = (client: any, account: any, target: `0x${string}`, data: `0x${string}`) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <EstimateGasFees client={client} account={account} target={target} data={data} />
    </QueryClientProvider>
  );
};

describe('EstimateGasFees Component', () => {
  it('renders the gas fee estimates with valid data', async () => {
    renderComponent(mockClient, mockAccount, "0xabcdef1234567890abcdef1234567890abcdef12", "0x123456");

    await waitFor(async () => {
      const maxFeePerGas = await screen.findByText(/Estimated Max Fees: 0.000126 ETH/);
      expect(maxFeePerGas).toBeTruthy();
    });
  }, 30000);

  it('renders the loading indicator while fetching data', async () => {
    renderComponent(mockClient, mockAccount, "0xabcdef1234567890abcdef1234567890abcdef12", "0x123456");

    const activityIndicator = screen.getByTestId('ActivityIndicator');
    expect(activityIndicator).toBeTruthy();

    await waitFor(() => {
      expect(screen.queryByTestId('ActivityIndicator')).toBeNull();
    });
  }, 30000);

  it('renders message when no data is available', async () => {
    renderComponent(mockClientNoData, mockAccount, "0xabcdef1234567890abcdef1234567890abcdef12", "0x");

    await waitFor(async () => {
      const message = await screen.findByText(/Unable to estimate gas fees/);
      expect(message).toBeTruthy();
    });
  }, 30000);
});
