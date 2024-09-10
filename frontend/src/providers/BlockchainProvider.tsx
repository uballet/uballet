import React, { createContext, useContext, ReactNode } from 'react';
import config from '../../netconfig/blockchain.default.json'; // Adjust the path as needed
import { BlockchainConfig } from '../../netconfig/blockchain-config';

interface BlockchainContextType {
    blockchain: BlockchainConfig;
  }

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const blockchain = config.sepolia; // Hardcoded sepolia for now

  return (
    <BlockchainContext.Provider value={{ blockchain }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchainContext = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchainContext must be used within a BlockchainProvider');
  }
  return context;
};
