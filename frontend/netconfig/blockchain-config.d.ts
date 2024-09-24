declare module "*.json" {
    const value: any;
    export default value;
  }

export interface ERC20Token {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    color: string;
    cmc_url: string;
    logo_url: string;
  }

export interface BlockchainConfig {
    block_explorer: string;
    api_key_endpoint: string;
    erc20_tokens: ERC20Token[];
}

export interface Config {
  arbitrum: BlockchainConfig;
  arbitrumSepolia: BlockchainConfig;
  base: BlockchainConfig;
  baseSepolia: BlockchainConfig;
  mainnet: BlockchainConfig;
  optimism: BlockchainConfig;
  optimismSepolia: BlockchainConfig;
  polygon: BlockchainConfig;
  polygonAmoy: BlockchainConfig;
  sepolia: BlockchainConfig;
}