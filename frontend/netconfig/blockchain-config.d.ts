declare module "*.json" {
    const value: any;
    export default value;
  }

export interface ERC20Token {
    name: string;
    symbol: string;
    address: string;
  }

export interface BlockchainConfig {
    block_explorer: string;
    erc20_tokens: ERC20Token[];
}

export interface Config {
  arbitrum: BlockchainConfig;
  arbitrumGoerli: BlockchainConfig;
  arbitrumSepolia: BlockchainConfig;
  base: BlockchainConfig;
  baseGoerli: BlockchainConfig;
  baseSepolia: BlockchainConfig;
  fraxtal: BlockchainConfig;
  fraxtalSepolia: BlockchainConfig;
  goerli: BlockchainConfig;
  mainnet: BlockchainConfig;
  optimism: BlockchainConfig;
  optimismGoerli: BlockchainConfig;
  optimismSepolia: BlockchainConfig;
  polygon: BlockchainConfig;
  polygonAmoy: BlockchainConfig;
  polygonMumbai: BlockchainConfig;
  sepolia: BlockchainConfig;
  zora: BlockchainConfig;
  zoraSepolia: BlockchainConfig;
}