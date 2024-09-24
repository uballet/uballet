import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../netconfig/blockchain.default.json';
import { BlockchainConfig, Config, ERC20Token } from '../../netconfig/blockchain-config';
import deepmerge from 'deepmerge';

const blockchain_name = "optimismSepolia";

interface BlockchainContextType {
  blockchain: BlockchainConfig;
  getUserTokens: () => Promise<ERC20Token[]>;
  addUserToken: (token: ERC20Token) => Promise<void>;
  removeUserToken: (address: string) => Promise<void>;
}

const mergeConfigs = (defaultConfig: Config, userTokens: ERC20Token[]): Config => {
  return deepmerge(defaultConfig, {
    [blockchain_name]: {
      erc20_tokens: userTokens,
    },
  });
};

const LOCAL_STORAGE_KEY = 'user_erc20_tokens_' + blockchain_name;

const loadUserTokens = async (): Promise<ERC20Token[]> => {
  try {
    const storedTokens = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
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

const saveUserTokens = async (tokens: ERC20Token[]) => {
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Failed to save user tokens to storage', error);
  }
};

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userTokens, setUserTokens] = useState<ERC20Token[]>([]);
  const [mergedConfig, setMergedConfig] = useState<BlockchainConfig>(config[blockchain_name]);

  useEffect(() => {
    const loadTokens = async () => {
      const tokens = await loadUserTokens();
      setUserTokens(tokens);
      const merged = mergeConfigs(config, tokens);
      setMergedConfig(merged[blockchain_name]);
    };
    loadTokens();
  }, []);

  useEffect(() => {
    const merged = mergeConfigs(config, userTokens);
    setMergedConfig(merged[blockchain_name]);
  }, [userTokens]);

  const getUserTokens = async (): Promise<ERC20Token[]> => {
    return userTokens;
  };

  const addUserToken = async (token: ERC20Token) => {
    const updatedTokens = [...userTokens, token];
    setUserTokens(updatedTokens);
    await saveUserTokens(updatedTokens);
  };

  const removeUserToken = async (address: string) => {
    const updatedTokens = userTokens.filter((token) => token.address !== address);
    setUserTokens(updatedTokens);
    await saveUserTokens(updatedTokens);
  };

  return (
    <BlockchainContext.Provider
      value={{ blockchain: mergedConfig, getUserTokens, addUserToken, removeUserToken }}
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
