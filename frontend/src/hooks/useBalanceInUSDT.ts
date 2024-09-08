import { useEffect, useState } from "react";
import { useBalance } from "./useBalance";
import { useTokenBalance } from "./useTokenBalance";
import UballetAPI from "../api/uballet";

interface Balances {
  [key: string]: number;
}

export function useBalanceInUSDT() {
  const [data, setData] = useState<Balances>(); // Holds the fetched data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  let balance = useBalance();
  let tokenBalances = useTokenBalance();

  // Add ETH balance to tokenBalances
  tokenBalances.ETH = balance;
  // Put ETH firt place in array
  const ethBalance = tokenBalances.ETH;
  delete tokenBalances.ETH;
  tokenBalances = { ETH: ethBalance, ...tokenBalances };
  // Parse all values in tokenBalances to float
  const tokenBalancesParsed = Object.fromEntries(
    Object.entries(tokenBalances).map(([key, value]) => [
      key,
      parseFloat(value),
    ])
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = "ETH";
      for (const token in tokenBalancesParsed) {
        if (token === "ETH") continue;
        query += `,${token}`;
      }
      const response = await UballetAPI.getQuote({ coin: query });
      // Convert token balances in USD
      const tokenBalancesInUSD: { [key: string]: number } = {};
      for (const token in tokenBalancesParsed) {
        tokenBalancesInUSD[token] =
          response[token] * tokenBalancesParsed[token];
      }
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setData(tokenBalancesInUSD);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Only re-run the effect if the URL changes

  return { data, loading, error, refetch: fetchData };
}
