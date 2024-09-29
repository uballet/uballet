import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../netconfig/blockchain.default.json';
import { BlockchainConfig, Config, ERC20Token } from '../../netconfig/blockchain-config';
import deepmerge from 'deepmerge';

interface BlockchainContextType {
  blockchain: BlockchainConfig;
  selectedNetwork: keyof Config;
  getUserTokens: () => Promise<ERC20Token[]>;
  addUserToken: (token: ERC20Token) => Promise<void>;
  removeUserToken: (address: string) => Promise<void>;
  setNetwork: (networkName: keyof Config) => void;
}

const mergeConfigs = (defaultConfig: Config, userTokens: ERC20Token[], networkName: keyof Config): Config => {
  return deepmerge(defaultConfig, {
    [networkName]: {
      erc20_tokens: userTokens,
    },
  });
};

const LOCAL_STORAGE_KEY = (networkName: keyof Config) => 'user_erc20_tokens_' + networkName;

const loadUserTokens = async (networkName: keyof Config): Promise<ERC20Token[]> => {
  try {
    const storedTokens = await AsyncStorage.getItem(LOCAL_STORAGE_KEY(networkName));
    if (storedTokens) {
      return JSON.parse(storedTokens);
    } else {
      return []
    }
  } catch (error) {
    console.error('Failed to load user tokens from storage', error);
    return [];
  }
};

const saveUserTokens = async (tokens: ERC20Token[], networkName: keyof Config) => {
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY(networkName), JSON.stringify(tokens));
  } catch (error) {
    console.error('Failed to save user tokens to storage', error);
  }
};

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<keyof Config>('sepolia');
  const [userTokens, setUserTokens] = useState<ERC20Token[]>([]);
  const [mergedConfig, setMergedConfig] = useState<BlockchainConfig>(config[selectedNetwork]);

  useEffect(() => {
    const loadTokens = async () => {
      const tokens = await loadUserTokens(selectedNetwork);
      setUserTokens(tokens);
      const merged = mergeConfigs(config, tokens, selectedNetwork);
      setMergedConfig(merged[selectedNetwork]);
    };
    loadTokens();
  }, [selectedNetwork]);

  useEffect(() => {
    const merged = mergeConfigs(config, userTokens, selectedNetwork);
    setMergedConfig(merged[selectedNetwork]);
  }, [userTokens, selectedNetwork]);

  const getUserTokens = async (): Promise<ERC20Token[]> => {
    return userTokens;
  };

  const addUserToken = async (token: ERC20Token) => {
    const updatedTokens = [...userTokens, token];
    setUserTokens(updatedTokens);
    await saveUserTokens(updatedTokens, selectedNetwork);
  };

  const removeUserToken = async (address: string) => {
    const updatedTokens = userTokens.filter((token) => token.address !== address);
    setUserTokens(updatedTokens);
    await saveUserTokens(updatedTokens, selectedNetwork);
  };

  const setNetwork = (networkName: string) => {
    const networkKey = networkName as keyof Config;
    setSelectedNetwork(networkKey);
  };
  

  return (
    <BlockchainContext.Provider
    value={{
      blockchain: mergedConfig,
      selectedNetwork,
      getUserTokens,
      addUserToken,
      removeUserToken,
      setNetwork,
    }}
  >
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
