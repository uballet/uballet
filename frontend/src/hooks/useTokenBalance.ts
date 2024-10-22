import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { ethers } from "ethers";
import { useBlockchainContext } from "../providers/BlockchainProvider";
import tokenInfo from "../../netconfig/erc20-token-info.json";

interface TokenBalances {
  [key: string]: string;
}

const getTokenDecimals = (symbol: string) => {
  const tokens_info = tokenInfo.erc20_tokens;
  const token = tokens_info.find((t) => t.symbol === symbol);
  const DEFAULT_TOKEN_DECIMALS = 18;
  return token ? token.decimals : DEFAULT_TOKEN_DECIMALS;
};

export function useTokenBalance() {
  const { sdkClient, lightAccount, initiator } = useAccountContext();
  const account = initiator || lightAccount;
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
        const balance = await sdkClient!.core.getTokenBalances(account.getAddress(), [
          token.address,
        ]);
        const tokenBalance = balance.tokenBalances[0]?.tokenBalance;

        if (tokenBalance && tokenBalance !== "0") {
          const decimals = getTokenDecimals(token.symbol);
          const redeableFormat = ethers.formatUnits(tokenBalance, decimals);
          balances[token.symbol] = redeableFormat;
        }
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
