import React from 'react';
import { render, screen } from '@testing-library/react-native';
import UserInfo from './UserInfo';

const SOME_ADDRESS = "0x3fE98C2F9C7D2aF4B5e2dFbFd146579E6F4D58F2";
const SHORTENED_ADDRESS = "0x3fE9...58F2";

describe('UserInfo Component', () => {
  it('renders the email', () => {
    render(<UserInfo email="user@example.com" contractDeployed={true} publicAddress={SOME_ADDRESS} />);
    const emailText = screen.getByText("user@example.com");
    expect(emailText).toBeTruthy();
  });

  it('displays a green icon when contract is deployed', () => {
    render(<UserInfo email="user@example.com" contractDeployed={true} publicAddress={SOME_ADDRESS} />);
    const icon = screen.getByTestId('user-icon');
    const iconStyle = icon.props.style.find((s: any) => s.backgroundColor);
    expect(iconStyle.backgroundColor).toBe('green');
  });

  it('displays a gray icon when contract is not deployed', () => {
    render(<UserInfo email="user@example.com" contractDeployed={false} publicAddress={SOME_ADDRESS} />);
    const icon = screen.getByTestId('user-icon');
    const iconStyle = icon.props.style.find((s: any) => s.backgroundColor);
    expect(iconStyle.backgroundColor).toBe('gray');
  });

  it('displays the shortened address and clipboard icon', () => {
    render(<UserInfo email="user@example.com" contractDeployed={true} publicAddress={SOME_ADDRESS} />);
    const addressText = screen.getByText(SHORTENED_ADDRESS);
    const clipboardIcon = screen.getByRole('button', { name: /copy address/i });
    expect(addressText).toBeTruthy();
    expect(clipboardIcon).toBeTruthy();
  });
});
