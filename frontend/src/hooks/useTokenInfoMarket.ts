import { useEffect, useState } from "react";
import UballetAPI from "../api/uballet";
import tokenInfo from "../../netconfig/erc20-token-info.json";
import { useBlockchainContext } from "../providers/BlockchainProvider";
import { all } from "axios";

interface TokenMarketInfo {
  [key: string]: {
    quote?: number;
    maxSupply?: number;
    circulatingSupply?: number;
    totalSupply?: number;
    volume24h?: number;
    percentChange24h?: number;
    marketCap?: number;
    marketCapDominance?: number;
    name?: string;
    logoUrl?: string;
    cmcUrl?: string;
  };
}

export function useTokenInfoMarket(symbol: string) {
  const [data, setData] = useState<TokenMarketInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const defaultTokensInfo = tokenInfo.erc20_tokens;
    const allTokensSymbols = [symbol];
    console.log("All Tokens Symbols:", allTokensSymbols);

    // Create a Balances objetct with all tokens frrom dataUseTokenBalance
    let tokensMarketInfo: TokenMarketInfo = Object.fromEntries(
      allTokensSymbols.map((token) => [
        token,
        {
          quote: undefined,
          maxSupply: undefined,
          circulatingSupply: undefined,
          totalSupply: undefined,
          volume24h: undefined,
          percentChange24h: undefined,
          marketCap: undefined,
          marketCapDominance: undefined,
          name: undefined,
          logoUrl: undefined,
          cmcUrl: undefined,
        },
      ])
    );

    try {
      let query = allTokensSymbols.join(",");
      const response = await UballetAPI.getQuote({ coin: query });

      console.log("Response:", response);

      for (const token in tokensMarketInfo) {
        if (response[token] === undefined) {
          // Remove token from tokensMarketInfo if not found in response
          console.log(`Token ${token} not found in response`);
          delete tokensMarketInfo[token];
          continue;
        }
        tokensMarketInfo[token].quote = response[token].quote ?? 0;
        tokensMarketInfo[token].maxSupply = response[token].max_supply;
        tokensMarketInfo[token].circulatingSupply =
          response[token].circulating_supply ?? 0;
        tokensMarketInfo[token].totalSupply = response[token].total_supply ?? 0;
        tokensMarketInfo[token].volume24h = response[token].volume_24h ?? 0;
        tokensMarketInfo[token].percentChange24h =
          response[token].percent_change_24h ?? 0;
        tokensMarketInfo[token].marketCap = response[token].market_cap ?? 0;
        tokensMarketInfo[token].marketCapDominance =
          response[token].market_cap_dominance ?? 0;
        tokensMarketInfo[token].name = response[token].name ?? undefined;
        tokensMarketInfo[token].logoUrl = response[token].logo_url ?? undefined;
        tokensMarketInfo[token].cmcUrl = response[token].cmc_url ?? undefined;

        console.log("Token:", token, "Data:", tokensMarketInfo[token]);
      }

      // Obtain name from defaultTokenInfo if not present
      for (const token in tokensMarketInfo) {
        if (tokensMarketInfo[token].name) continue;

        const tokenInfo = defaultTokensInfo.find((t) => t.symbol === token);
        if (tokenInfo) {
          tokensMarketInfo[token].name = tokenInfo.name;
        }
      }

      // Obtain logoUrl from defaultTokenInfo if not present
      for (const token in tokensMarketInfo) {
        if (tokensMarketInfo[token].logoUrl) {
          continue;
        }

        const tokenInfo = defaultTokensInfo.find((t) => t.symbol === token);
        if (tokenInfo) {
          tokensMarketInfo[token].logoUrl = tokenInfo.logo_url;
        }
      }

      // Obtain cmcUrl from defaultTokenInfo if not present
      for (const token in tokensMarketInfo) {
        if (tokensMarketInfo[token].cmcUrl) {
          continue;
        }

        const tokenInfo = defaultTokensInfo.find((t) => t.symbol === token);
        if (tokenInfo) {
          tokensMarketInfo[token].cmcUrl = tokenInfo.cmc_url;
        }
      }

      setData(tokensMarketInfo);
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
  }, []);

  return { data, loading, error, refetch: fetchData };
}
