import { useEffect, useState } from "react";
import { useBalance } from "./useBalance";
import { useTokenBalance } from "./useTokenBalance";
import UballetAPI from "../api/uballet";

interface Balances {
  [key: string]: { balance: number; quote: number };
}

export function useBalanceInUSDT() {
  const [data, setData] = useState<Balances>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  let {
    balance: dataUseBalance,
    loading: loadingUseBalance,
    error: errorUseBalance,
    refreshData: refreshDataUseBalance,
  } = useBalance();

  let {
    tokenBalances: dataUseTokenBalance,
    loading: loadingUseTokenBalance,
    error: errorUseTokenBalance,
    refreshData: refreshDataUseTokenBalance,
  } = useTokenBalance();

  const refetchFunction = () => {
    refreshDataUseBalance();
    refreshDataUseTokenBalance();
  };

  const fetchData = async () => {
    setLoading(true);

    if (loadingUseBalance || loadingUseTokenBalance) {
      console.log("ETH balance or Tokens Balance still loading...");
      return;
    }
    if (errorUseBalance || errorUseTokenBalance) {
      console.error("Error fetching balances");
      setError("Error fetching balances");
      setLoading(false);
      return;
    }

    console.log("Updating quotes for tokens...");

    // Add ETH balance to tokenBalances
    if (dataUseBalance !== null) {
      dataUseTokenBalance.ETH = dataUseBalance;
    }

    // Parse all values in tokenBalances to float
    const tokenBalancesParsed = Object.fromEntries(
      Object.entries(dataUseTokenBalance).map(([key, value]) => [
        key,
        parseFloat(value),
      ])
    );

    try {
      // Get quotes for all tokens from API
      let query = "ETH";
      for (const token in tokenBalancesParsed) {
        if (token === "ETH") continue;
        query += `,${token}`;
      }
      const response = await UballetAPI.getQuote({ coin: query });

      // Convert token balances to USDT
      const tokenBalancesInUSD: {
        [key: string]: { balance: number; quote: number };
      } = {};
      for (const token in tokenBalancesParsed) {
        tokenBalancesInUSD[token] = {
          balance: tokenBalancesParsed[token],
          quote: response[token] * tokenBalancesParsed[token],
        };
      }

      // Sort tokenBalancesInUSD by quote field
      const sortedTokens = Object.entries(tokenBalancesInUSD).sort(
        (a, b) => b[1].quote - a[1].quote
      );
      let sortedTokenBalances: Balances = Object.fromEntries(sortedTokens);

      // Put ETH first place in sortedTokenBalances
      const ethBalance = sortedTokenBalances.ETH;
      delete sortedTokenBalances.ETH;
      sortedTokenBalances = { ETH: ethBalance, ...sortedTokenBalances };

      setData(sortedTokenBalances);
    } catch (err) {
      console.error("Failed to fetch data");
      setError("Failed to fetch data");
      setLoading(false);
    } finally {
      console.log("Quotes updated successfully");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [loadingUseBalance, loadingUseTokenBalance]);

  return { data, loading, error, refetch: refetchFunction };
}
