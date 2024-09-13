import { useEffect, useState } from "react";
import { useBalance } from "./useBalance";
import { useTokenBalance } from "./useTokenBalance";
import UballetAPI from "../api/uballet";

interface Balances {
  [key: string]: { balance: number; quote: number };
}

export function useBalanceInUSDT() {
  const [data, setData] = useState<Balances>(); // Holds the fetched data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  let {
    balance: dataUseBalance,
    loading: loadingUseBalance,
    error: errorUseBalance,
  } = useBalance();

  let {
    tokenBalances: dataUseTokenBalance,
    loading: loadingUseTokenBalance,
    error: errorUseTokenBalance,
  } = useTokenBalance();

  const fetchData = async () => {
    setLoading(true);
    // Add ETH balance to tokenBalances
    if (dataUseBalance !== null) {
      dataUseTokenBalance.ETH = dataUseBalance;
    }

    // Put ETH firt place in array
    const ethBalance = dataUseTokenBalance.ETH;
    delete dataUseTokenBalance.ETH;
    dataUseTokenBalance = { ETH: ethBalance, ...dataUseTokenBalance };

    // Parse all values in tokenBalances to float
    const tokenBalancesParsed = Object.fromEntries(
      Object.entries(dataUseTokenBalance).map(([key, value]) => [
        key,
        parseFloat(value),
      ])
    );
    // If balance is loading, or dataUseBalance is NaN, return
    if (
      loadingUseBalance ||
      loadingUseTokenBalance ||
      isNaN(tokenBalancesParsed["ETH"])
    ) {
      return;
    }
    try {
      let query = "ETH";
      for (const token in tokenBalancesParsed) {
        if (token === "ETH") continue;
        query += `,${token}`;
      }
      const response = await UballetAPI.getQuote({ coin: query });
      // Convert token balances in USD
      const tokenBalancesInUSD: {
        [key: string]: { balance: number; quote: number };
      } = {};
      for (const token in tokenBalancesParsed) {
        tokenBalancesInUSD[token] = {
          balance: tokenBalancesParsed[token],
          quote: response[token] * tokenBalancesParsed[token],
        };
      }
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
  }, [dataUseTokenBalance, loadingUseBalance, loadingUseTokenBalance]);

  return { data, loading, error, refetch: fetchData };
}
