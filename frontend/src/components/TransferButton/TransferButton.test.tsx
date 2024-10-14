import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import TransferButton from './TransferButton';
import { ActivityIndicator } from 'react-native-paper';

jest.useFakeTimers();

describe('TransferButton Component', () => {
  const mockTransferETH = jest.fn();
  const mockTransferToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the transfer button with default text', () => {
    render(
      <TransferButton
        currency="ETH"
        ethSymbol="ETH"
        loading={false}
        onTransferETH={mockTransferETH}
        onTransferToken={mockTransferToken}
      />
    );

    const button = screen.getByText('Transfer!');
    expect(button).toBeTruthy();
  });

  it('calls onTransferETH when the button is pressed for ETH transfer', () => {
    render(
      <TransferButton
        currency="ETH"
        ethSymbol="ETH"
        loading={false}
        onTransferETH={mockTransferETH}
        onTransferToken={mockTransferToken}
      />
    );

    const button = screen.getByText('Transfer!');
    fireEvent.press(button);

    expect(mockTransferETH).toHaveBeenCalled();
    expect(mockTransferToken).not.toHaveBeenCalled();
  });

  it('calls onTransferToken when the button is pressed for token transfer', () => {
    render(
      <TransferButton
        currency="DAI"
        ethSymbol="ETH"
        loading={false}
        onTransferETH={mockTransferETH}
        onTransferToken={mockTransferToken}
      />
    );

    const button = screen.getByText('Transfer!');
    fireEvent.press(button);

    expect(mockTransferToken).toHaveBeenCalled();
    expect(mockTransferETH).not.toHaveBeenCalled();
  });

  it('displays an ActivityIndicator when loading is true', () => {
    render(
      <TransferButton
        currency="ETH"
        ethSymbol="ETH"
        loading={true}
        onTransferETH={mockTransferETH}
        onTransferToken={mockTransferToken}
      />
    );

    const activityIndicator = screen.getByTestId('transfer-button-activity-indicator');
    expect(activityIndicator).toBeTruthy();
  });

  it('disables the button when loading is true', () => {
    render(
      <TransferButton
        currency="ETH"
        ethSymbol="ETH"
        loading={true}
        onTransferETH={mockTransferETH}
        onTransferToken={mockTransferToken}
      />
    );
  
    const button = screen.getByTestId('transfer-button');
  
    fireEvent.press(button);
  
    expect(mockTransferETH).not.toHaveBeenCalled();
    expect(mockTransferToken).not.toHaveBeenCalled();
  });
});
