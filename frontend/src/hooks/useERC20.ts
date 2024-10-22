import { useAccountContext } from "./useAccountContext";
import { ethers } from "ethers";

// Custom hook that provides functions to interact with ERC20 contracts
export function useERC20() {
  const { sdkClient } = useAccountContext();
  const provider = new ethers.JsonRpcProvider(sdkClient!.config.url);

  const isERC20Contract = async (address: string): Promise<boolean> => {
    const erc20Abi = [
      "function totalSupply() public view returns (uint256)",
      "function balanceOf(address account) public view returns (uint256)",
      "function transfer(address recipient, uint256 amount) public returns (bool)",
      "event Transfer(address indexed from, address indexed to, uint256 value)",
    ];

    try {
      const contract = new ethers.Contract(address, erc20Abi, provider);
      await contract.totalSupply();
      return true;
    } catch (err) {
      return false;
    }
  };

  const getTokenBalance = async (address: string, tokenAddress: string) => {
    const erc20Abi = ["function balanceOf(address account) public view returns (uint256)"];
    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    const balance = await contract.balanceOf(address);
    return balance;
  };

  const getERC20Name = async (address: string): Promise<string> => {
    const erc20Abi = ["function name() view returns (string)"];
    const contract = new ethers.Contract(address, erc20Abi, provider);

    try {
      const name = await contract.name();
      return name;
    } catch (err) {
      throw new Error("Unable to get the ERC-20 contract name.");
    }
  };

  const getERC20Symbol = async (address: string): Promise<string> => {
    const erc20Abi = ["function symbol() view returns (string)"];
    const contract = new ethers.Contract(address, erc20Abi, provider);

    try {
      const symbol = await contract.symbol();
      return symbol;
    } catch (err) {
      throw new Error("Unable to get the ERC-20 contract symbol.");
    }
  };

  return { isERC20Contract, getERC20Name, getERC20Symbol, getTokenBalance };
}
