import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { ethers } from "ethers";
import config from "../../netconfig/blockchain.default.json";

interface TokenBalances {
  [key: string]: string; // Adjust the type as needed
}

export function useTokenBalance() {
  const { sdkClient, account } = useAccountContext();
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger refresh

  const tokens = config.sepolia.erc20_tokens;

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
        const balance = await sdkClient.core.getTokenBalances(account.getAddress(), [
          token.address,
        ]);
        const tokenBalance = balance.tokenBalances[0]?.tokenBalance;

        if (tokenBalance && tokenBalance !== "0") {
          const decimals = token.decimals;
          const redeableFormat = ethers.formatUnits(tokenBalance, decimals);
          balances[token.symbol] = redeableFormat; // Format the balance to a readable format
        }
      }
      setTokenBalances(balances);
      setLoading(false);
    } catch {
      console.error("Error fetching token balances");
      setError("Error fetching token balances");
      setLoading(false);
    } finally {
      console.log("Token balances fetched");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Running useTokenBalance useEffect...");
    if (account!.getAddress()) {
      getTokenBalances();
    }
    console.log("useTokenBalance useEffect finished");
  }, [refreshKey]);

  // Function to trigger data refresh
  const refreshData = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return { tokenBalances, loading, error, refreshData };
}
