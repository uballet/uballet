import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import TransferInput from './TransferInput';

jest.useFakeTimers()

describe('TransferInput Component', () => {
  const mockCurrencies = ['ETH', 'DAI', 'USDC'];
  const mockHandleAmountChange = jest.fn();
  const mockSetCurrency = jest.fn();

  it('renders the amount input and currency picker', () => {
    render(
      <TransferInput
        amount="0.1234"
        currency="ETH"
        currencies={mockCurrencies}
        isAmountValid={true}
        handleAmountChange={mockHandleAmountChange}
        setCurrency={mockSetCurrency}
      />
    );

    const amountInput = screen.getByPlaceholderText('0.0000');
    expect(amountInput).toBeTruthy();

    const picker = screen.getByTestId('transfer-input-picker');
    expect(picker).toBeTruthy();
  });

  it('calls handleAmountChange when the amount input changes', () => {
    render(
      <TransferInput
        amount=""
        currency="ETH"
        currencies={mockCurrencies}
        isAmountValid={true}
        handleAmountChange={mockHandleAmountChange}
        setCurrency={mockSetCurrency}
      />
    );

    const amountInput = screen.getByPlaceholderText('0.0000');
    fireEvent.changeText(amountInput, '0.5');

    expect(mockHandleAmountChange).toHaveBeenCalledWith('0.5');
  });

  it('calls setCurrency when the currency is changed', () => {
    render(
      <TransferInput
        amount="0.1234"
        currency="ETH"
        currencies={mockCurrencies}
        isAmountValid={true}
        handleAmountChange={mockHandleAmountChange}
        setCurrency={mockSetCurrency}
      />
    );

    const picker = screen.getByTestId('transfer-input-picker');
    fireEvent(picker, 'onValueChange', 'DAI');

    expect(mockSetCurrency).toHaveBeenCalledWith('DAI');
  });

  it('displays an error message when the amount is invalid', () => {
    render(
      <TransferInput
        amount=""
        currency="ETH"
        currencies={mockCurrencies}
        isAmountValid={false}
        handleAmountChange={mockHandleAmountChange}
        setCurrency={mockSetCurrency}
      />
    );

    const errorMessage = screen.getByText('Amount must be greater than 0');
    expect(errorMessage).toBeTruthy();
  });
});
