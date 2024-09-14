import { useEffect, useState } from "react";
import { useBalance } from "./useBalance";
import { useTokenBalance } from "./useTokenBalance";
import UballetAPI from "../api/uballet";

interface Balances {
  [key: string]: { balance: number; quote: number };
}

const roundNumber = (num: number, decimalPlaces: number) => {
  return (
    Math.round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
  );
};

export function useBalanceInUSDT() {
  const [data, setData] = useState<Balances>();
  const [totalSumData, setTotalSumData] = useState<number>(0);
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
        // Round balance to 4 decimal places
        const balance = tokenBalancesParsed[token];
        const quote = response[token] * tokenBalancesParsed[token];
        tokenBalancesInUSD[token] = {
          balance: balance,
          quote: roundNumber(quote, 2),
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

      // Calculate total sum of all tokens
      let totalSum = 0;
      for (const token in sortedTokenBalances) {
        totalSum += sortedTokenBalances[token].quote;
      }

      setTotalSumData(totalSum);
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

  return { data, totalSumData, loading, error, refetch: refetchFunction };
}
