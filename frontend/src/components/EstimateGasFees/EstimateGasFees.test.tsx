import { render, screen, waitFor } from '@testing-library/react-native';
import EstimateGasFees from './EstimateGasFees';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as gasEstimationHooks from '../../hooks/useGasEstimation';
import * as accountContextHooks from '../../hooks/useAccountContext';
import { toHex } from 'viem';

const mockClient = {
  buildUserOperation: async () => ({
    preVerificationGas: toHex(21000n),
    callGasLimit: toHex(21000n),
    verificationGasLimit: toHex(21000n),
    maxPriorityFeePerGas: toHex(2000000000n),
    maxFeePerGas: toHex(2000000000n),
    nonce: "0x1",
    initCode: "0xabcdef",
    sender: "0x1234567890abcdef1234567890abcdef12345678",
  }),
  getBalance: async () => Promise.resolve(50n),
  getAddress: async () => Promise.resolve("0x1234567890abcdef1234567890abcdef12345678"),
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
      <EstimateGasFees target={target} data={data} />
    </QueryClientProvider>
  );
};

describe('EstimateGasFees Component', () => {
  it('renders the gas fee estimates with valid data', async () => {
    // @ts-ignore
    jest.spyOn(accountContextHooks, 'useAccountContext').mockImplementation(() => ({ lightAccount: mockClient }));
      //rest of the test
    renderComponent(mockClient, mockAccount, "0xabcdef1234567890abcdef1234567890abcdef12", "0x123456");

    await waitFor(async () => {
      const maxFeePerGas = await screen.findByText(/Estimated Max Fees/);
      expect(maxFeePerGas).toBeTruthy();
    });
  }, 30000);

  it('renders the loading indicator while fetching data', async () => {
    // @ts-ignore
    jest.spyOn(gasEstimationHooks, 'useGasEstimation').mockImplementation(() => ({ data: null, isLoading: true, isError: false }));
    // @ts-ignore
    jest.spyOn(accountContextHooks, 'useAccountContext').mockImplementation(() => ({ lightAccount: mockClient, getBalance: () => Promise.resolve(50n) }));

    renderComponent(mockClient, mockAccount, "0xabcdef1234567890abcdef1234567890abcdef12", "0x123456");

    const activityIndicator = screen.getByTestId('ActivityIndicator');
    expect(activityIndicator).toBeTruthy();
  }, 30000);

  it('renders message when no data is available', async () => {
    // @ts-ignore
    jest.spyOn(gasEstimationHooks, 'useGasEstimation').mockImplementation(() => ({ data: null, isLoading: false, isError: true }));
    renderComponent(mockClientNoData, mockAccount, "0xabcdef1234567890abcdef1234567890abcdef12", "0x");

    await waitFor(async () => {
      const message = await screen.findByText(/Unable to estimate gas fees/);
      expect(message).toBeTruthy();
    });
  }, 30000);
});
