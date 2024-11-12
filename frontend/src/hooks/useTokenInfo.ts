import { useEffect, useState } from "react";
import { useBalance } from "./useBalance";
import { useTokenBalance } from "./useTokenBalance";
import UballetAPI from "../api/uballet";
import tokenInfo from "../../netconfig/erc20-token-info.json";
import { useBlockchainContext } from "../providers/BlockchainProvider";

interface Balances {
  [key: string]: {
    balance: number;
    balanceInUSDT?: number;
    name?: string;
    logoUrl?: string;
  };
}

export function useTokenInfo() {
  const [data, setData] = useState<Balances>();
  const [totalSumData, setTotalSumData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const defaultTokensInfo = tokenInfo.erc20_tokens;

  const { getUserTokens } = useBlockchainContext();

  let {
    data: dataUseBalance,
    isLoading: loadingUseBalance,
    error: errorUseBalance,
    refetch: refreshDataUseBalance,
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
      setError("Error fetching balances");
      setLoading(false);
      return;
    }

    const userTokens = await getUserTokens();

    // Parse dataUseBalance and dataUseTokenBalance to float
    const ethBalance = parseFloat(dataUseBalance ?? "0");

    const tokenBalances = Object.fromEntries(
      Object.keys(dataUseTokenBalance).map((token) => [
        token,
        parseFloat(dataUseTokenBalance[token]),
      ])
    );

    // Unified ethBalance and tokenBalances in one object
    const allBalances = { ...tokenBalances };
    allBalances.ETH = ethBalance;

    // Create a Balances objetct with all tokens frrom dataUseTokenBalance
    let balances: Balances = Object.fromEntries(
      Object.keys(allBalances).map((token) => [
        token,
        {
          balance: allBalances[token],
          balanceInUSDT: undefined,
          name: undefined,
          logoUrl: undefined,
        },
      ])
    );

    try {
      let query = "ETH";
      for (const token in balances) {
        if (token === "ETH") continue;
        query += `,${token}`;
      }
      const response = await UballetAPI.getQuote({ coin: query });

      for (const token in balances) {
        if (response[token] === undefined) {
          continue;
        }
        const balance = balances[token].balance;
        balances[token].balanceInUSDT = (response[token].quote ?? 0) * balance;
        balances[token].name = response[token].name ?? undefined;
        balances[token].logoUrl = response[token].logo_url ?? undefined;
      }

      // Obtain name from defaultTokenInfo
      for (const token in balances) {
        if (balances[token].name) continue;

        const tokenInfo = defaultTokensInfo.find((t) => t.symbol === token);
        if (tokenInfo) {
          balances[token].name = tokenInfo.name;
        } else {
          // If tokenInfo is not found, try to get name from the ERC20 contract
          const tokenInfo = userTokens.find((t) => t.symbol === token);
          if (tokenInfo) {
            balances[token].name = tokenInfo.name;
          }
        }
      }

      // Obtain logoUrl
      for (const token in balances) {
        if (balances[token].logoUrl) continue;

        const tokenInfo = defaultTokensInfo.find((t) => t.symbol === token);
        if (tokenInfo) {
          balances[token].logoUrl = tokenInfo.logo_url;
        } else {
          // If tokenInfo is not found, try to get name from the ERC20 contract
          const tokenInfo = userTokens.find((t) => t.symbol === token);
          if (tokenInfo) {
            balances[token].name = tokenInfo.name;
          }
        }
      }

      // Sort balances by balanceInUSDT field
      const sortedBalances = Object.entries(balances).sort(
        (a, b) => (b[1].balanceInUSDT ?? 0) - (a[1].balanceInUSDT ?? 0)
      );
      let sortedTokenBalances: Balances = Object.fromEntries(sortedBalances);

      // Put ETH first place in sortedTokenBalances
      const ethBalance = sortedTokenBalances.ETH;
      delete sortedTokenBalances.ETH;
      sortedTokenBalances = { ETH: ethBalance, ...sortedTokenBalances };

      // Calculate total sum of all tokens
      let totalSum = 0;
      for (const token in sortedTokenBalances) {
        totalSum += sortedTokenBalances[token].balanceInUSDT ?? 0;
      }

      setTotalSumData(totalSum);
      setData(sortedTokenBalances);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to fetch data");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [loadingUseBalance, loadingUseTokenBalance]);

  return { data, totalSumData, loading, error, refetch: refetchFunction };
}
