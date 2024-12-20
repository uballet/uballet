declare module "*.json" {
  const value: any;
  export default value;
}

export interface ERC20Token {
  name: string;
  symbol: string;
  address: string;
}

export interface ERC20TokenInfo {
  name: string,
  symbol: string,
  decimals: number;
  color: string;
  cmc_url: string;
  logo_url: string;
}

export interface BlockchainConfig {
  name: string;
  block_explorer: string;
  api_key_endpoint: string;
  erc20_tokens: ERC20Token[];
  sdk_name: Network;
  supports_internal_transaction_history: boolean;
}

export interface Config {
  arbitrum: BlockchainConfig;
  arbitrumSepolia: BlockchainConfig;
  base: BlockchainConfig;
  baseSepolia: BlockchainConfig;
  mainnet: BlockchainConfig;
  optimism: BlockchainConfig;
  optimismSepolia: BlockchainConfig;
  sepolia: BlockchainConfig;
}

export interface ERC20TokenInfoConfig {
  erc20_tokens: ERC20TokenInfo;
}
