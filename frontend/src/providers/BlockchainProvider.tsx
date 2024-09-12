import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import config from '../../netconfig/blockchain.default.json'; // Default config
import userConfig from '../../netconfig/blockchain.user.json'; // User config
import { BlockchainConfig, Config } from '../../netconfig/blockchain-config';
import deepmerge from 'deepmerge';

const blockchain_name = "sepolia" // Hard-coded sepolia for now

interface BlockchainContextType {
  blockchain: BlockchainConfig;
}

const mergeConfigs = (defaultConfig: Config, userConfig: Partial<Config>): Config => {
  return deepmerge(defaultConfig, userConfig, {
    arrayMerge: (destinationArray, sourceArray) => [...destinationArray, ...sourceArray],
  });
};

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mergedConfig, setMergedConfig] = useState<BlockchainConfig>(config[blockchain_name]);

  useEffect(() => {
    const merged = mergeConfigs(config, userConfig as Partial<Config>);
    setMergedConfig(merged[blockchain_name]);
  }, []);

  return (
    <BlockchainContext.Provider value={{ blockchain: mergedConfig }}>
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
