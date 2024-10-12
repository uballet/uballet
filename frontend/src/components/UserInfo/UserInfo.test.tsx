import React from 'react';
import { render, screen } from '@testing-library/react-native';
import UserInfo from './UserInfo';

describe('UserInfo Component', () => {
  it('renders the email', () => {
    render(<UserInfo email="user@example.com" contractDeployed={true} />);
    const emailText = screen.getByText("user@example.com");
    expect(emailText).toBeTruthy();
  });

  it('displays a green icon when contract is deployed', () => {
    render(<UserInfo email="user@example.com" contractDeployed={true} />);
    const icon = screen.getByTestId('user-icon');
    const iconStyle = icon.props.style.find((s: any) => s.backgroundColor);
    expect(iconStyle.backgroundColor).toBe('green');
  });

  it('displays a gray icon when contract is not deployed', () => {
    render(<UserInfo email="user@example.com" contractDeployed={false} />);
    const icon = screen.getByTestId('user-icon');
    const iconStyle = icon.props.style.find((s: any) => s.backgroundColor);
    expect(iconStyle.backgroundColor).toBe('gray');
  });
});
