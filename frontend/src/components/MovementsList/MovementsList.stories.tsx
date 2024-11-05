import React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import MovementsList from "./MovementsList";
import { View } from "react-native";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import necessary modules
import { AssetTransfersCategory, AssetTransfersWithMetadataResult } from 'alchemy-sdk';

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
    category: AssetTransfersCategory.EXTERNAL,
    blockNum: '12345678',
    erc721TokenId: null,
    erc1155Metadata: null,
    tokenId: null,
    // @ts-ignore
    rawContract: undefined,
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
    category: AssetTransfersCategory.EXTERNAL,
    blockNum: '12345679',
    erc721TokenId: null,
    erc1155Metadata: null,
    tokenId: null,
    // @ts-ignore
    rawContract: undefined,
  },
];

const MovementsListMeta: Meta<typeof MovementsList> = {
  title: "MovementsList",
  component: MovementsList,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <View style={{ padding: 20 }}>
          <Story />
        </View>
      </QueryClientProvider>
    ),
  ],
};

export default MovementsListMeta;

type Story = StoryObj<typeof MovementsListMeta>;

export const Default: Story = {
  args: {
    toTransfers: mockTransfers,
    fromTransfers: mockTransfers,
    maxRows: 10,
  },
};

export const EmptyList: Story = {
  args: {
    toTransfers: [],
    fromTransfers: [],
    maxRows: 10,
  },
};
