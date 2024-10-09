import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MovementsList from './movementsList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AssetTransfersWithMetadataResult } from 'alchemy-sdk';
import { useContacts } from '../../hooks/contacts/useContacts';

jest.mock('../../hooks/contacts/useContacts');

const queryClient = new QueryClient();

const mockTransfers: AssetTransfersWithMetadataResult[] = [
  {
    asset: 'ETH',
    value: 1.2345,
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
    hash: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    metadata: {
      blockTimestamp: new Date().toISOString(),
    },
    uniqueId: 'unique-id-1',
    category: 'external',
    blockNum: '12345678',
    erc721TokenId: null,
    erc1155Metadata: null,
    tokenId: null,
  },
  {
    asset: 'ETH',
    value: 0.5678,
    from: '0xabcdef1234567890abcdef1234567890abcdef12',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    hash: '0x1234561234561234561234561234561234561234561234561234561234561234',
    metadata: {
      blockTimestamp: new Date().toISOString(),
    },
    uniqueId: 'unique-id-2',
    category: 'external',
    blockNum: '12345679',
    erc721TokenId: null,
    erc1155Metadata: null,
    tokenId: null,
  },
];

const renderComponent = (toTransfers: AssetTransfersWithMetadataResult[] | null, fromTransfers: AssetTransfersWithMetadataResult[] | null, maxRows?: number) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MovementsList toTransfers={toTransfers} fromTransfers={fromTransfers} maxRows={maxRows} />
    </QueryClientProvider>
  );
};

describe('MovementsList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state when contacts are loading', () => {
    (useContacts as jest.Mock).mockReturnValue({
      contacts: [],
      isLoading: true,
    });

    renderComponent(null, null);

    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('displays "No transactions found" when there are no transfers', () => {
    (useContacts as jest.Mock).mockReturnValue({
      contacts: [],
      isLoading: false,
    });

    renderComponent([], []);

    expect(screen.getByText('No transactions found')).toBeTruthy();
  });

  it('displays the list of transactions when transfers are available', () => {
    (useContacts as jest.Mock).mockReturnValue({
      contacts: [],
      isLoading: false,
    });
  
    renderComponent(mockTransfers, mockTransfers);
  
    // All transactions are found twice because we are using the same mocks
    // for incoming and outgoing transfers
    const fromAddresses = screen.getAllByText('0x12345...45678');
    expect(fromAddresses).toHaveLength(2);
  
    const toAddresses = screen.getAllByText('0xabcde...def12');
    expect(toAddresses).toHaveLength(2);

    const firstTransactionValue = screen.getAllByText(/[-+]1\.2345\s+ETH/);
    expect(firstTransactionValue).toHaveLength(2); // once for positive, once for negative

    const secondTransactionValue = screen.getAllByText(/[-+]0\.5678\s+ETH/);
    expect(secondTransactionValue).toHaveLength(2);
  });
  

  it('limits the displayed transactions to the maxRows value', () => {
    (useContacts as jest.Mock).mockReturnValue({
      contacts: [],
      isLoading: false,
    });

    renderComponent(mockTransfers, mockTransfers, 1);

    const items = screen.getAllByTestId('transaction-item');
    expect(items).toHaveLength(1);
  });
});
