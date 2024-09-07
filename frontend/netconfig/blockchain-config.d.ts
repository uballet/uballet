declare module "*.json" {
    const value: any;
    export default value;
  }

interface ERC20Token {
    name: string;
    symbol: string;
    address: string;
  }
  
interface BlockchainConfig {
    block_explorer: string;
    erc20_tokens: ERC20Token[];
}
  
interface Config {
    sepolia: BlockchainConfig;
    ethereum: BlockchainConfig;
}