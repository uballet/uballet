import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ContactInput from './ContactInput';

jest.useFakeTimers();

describe('ContactInput Component', () => {
  const mockHandleAddressChange = jest.fn();

  it('renders the input field and error message when invalid', () => {
    render(
      <ContactInput
        toAddress="invalidAddress"
        handleAddressChange={mockHandleAddressChange}
        isAddressValid={false}
      />
    );

    const addressInput = screen.getByPlaceholderText('Address without 0x prefix');
    expect(addressInput).toBeTruthy();

    const errorText = screen.getByText('Invalid Ethereum address');
    expect(errorText).toBeTruthy();
  });

  it('calls handleAddressChange when the address input changes', () => {
    render(
      <ContactInput
        toAddress=""
        handleAddressChange={mockHandleAddressChange}
        isAddressValid={true}
      />
    );

    const addressInput = screen.getByPlaceholderText('Address without 0x prefix');
    fireEvent.changeText(addressInput, '3fE98C2F9C7D2aF4B5e2dFbFd146579E6F4D58F2');
    
    expect(mockHandleAddressChange).toHaveBeenCalledWith('3fE98C2F9C7D2aF4B5e2dFbFd146579E6F4D58F2');
  });

  it('does not display error message when address is valid', () => {
    render(
      <ContactInput
        toAddress="3fE98C2F9C7D2aF4B5e2dFbFd146579E6F4D58F2"
        handleAddressChange={mockHandleAddressChange}
        isAddressValid={true}
      />
    );

    const errorText = screen.queryByText('Invalid Ethereum address');
    expect(errorText).toBeNull();
  });
});
