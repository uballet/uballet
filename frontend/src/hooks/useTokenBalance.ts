import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { BigNumberish, ethers } from "ethers";
import { useBlockchainContext } from "../providers/BlockchainProvider";
import tokenInfo from "../../netconfig/erc20-token-info.json";
import { useERC20 } from "./useERC20";
import { ERC20Token } from "../../netconfig/blockchain-config";
import { Alchemy } from "alchemy-sdk";

interface TokenBalances {
  [key: string]: string;
}

const getTokenDecimals = async (
  sdkClient: Alchemy | null,
  tokens: ERC20Token[],
  symbol: string
) => {
  const tokens_info = tokenInfo.erc20_tokens;
  const token = tokens_info.find((t) => t.symbol === symbol);
  const DEFAULT_TOKEN_DECIMALS = 18;

  if (token) {
    return token.decimals;
  } else {
    try {
      const token = tokens.find((t) => t.symbol === symbol);
      const tokenContractAddress = token?.address;

      if (!tokenContractAddress) {
        console.log("Token contract address not found for symbol:", symbol);
        return DEFAULT_TOKEN_DECIMALS;
      }

      const abi = ["function decimals() view returns (uint8)"];
      const provider = await sdkClient!.config.getProvider();
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        abi,
        provider
      );
      const decimals = await tokenContract.decimals();
      return decimals;
    } catch (error) {
      console.log("Failed to fetch token decimals:", error);
      return DEFAULT_TOKEN_DECIMALS;
    }
  }
};

export function useTokenBalance() {
  const { lightAccount, initiator, sdkClient } = useAccountContext();
  const account = initiator || lightAccount;
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { getTokenBalance } = useERC20();

  const { blockchain } = useBlockchainContext();
  const tokens = blockchain.erc20_tokens;

  if (!account) {
    throw new Error("Account not ready");
  }

  const getTokenBalances = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching token balances...");
      const balances: TokenBalances = {};

      for (const token of tokens) {
        const balance: BigNumberish = await getTokenBalance(
          account.getAddress(),
          token.address
        );

        const decimals = await getTokenDecimals(
          sdkClient,
          tokens,
          token.symbol
        );
        const redeableFormat = ethers.formatUnits(balance, decimals);

        console.log(
          "For token",
          token.symbol,
          "raw balance is:",
          balance,
          "decimals are:",
          decimals,
          "redeable balance is:",
          redeableFormat
        );

        balances[token.symbol] = redeableFormat;
      }
      setTokenBalances(balances);
      setLoading(false);
    } catch {
      setError("Error fetching token balances");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account!.getAddress()) {
      getTokenBalances();
    }
  }, [refreshKey]);

  const refreshData = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return { tokenBalances, loading, error, refreshData };
}
