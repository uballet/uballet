import { useEffect, useState } from "react";
import UballetAPI from "../api/uballet";
import tokenInfo from "../../netconfig/erc20-token-info.json";
import { useBlockchainContext } from "../providers/BlockchainProvider";

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

export function useTokenInfoMarket() {
  const [data, setData] = useState<TokenMarketInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { blockchain } = useBlockchainContext();
  const tokens = blockchain.erc20_tokens;

  const fetchData = async () => {
    setLoading(true);

    const defaultTokensInfo = tokenInfo.erc20_tokens;
    const userTokens = blockchain.erc20_tokens;

    const allTokens = tokens;
    const allTokensSymbols = Object.entries(allTokens).map(
      ([key, value]) => (value as { symbol: string }).symbol
    );

    // Add ETH to allTokensSymbols
    allTokensSymbols.push("ETH");

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
      let query = "ETH";
      for (const token in tokensMarketInfo) {
        if (token === "ETH") continue;
        query += `,${token}`;
      }

      const response = await UballetAPI.getQuote({ coin: query });

      console.log("Response:", response);

      for (const token in tokensMarketInfo) {
        if (response[token] === undefined) {
          console.error(`Token ${token} not found in response`);
          continue;
        }
        console.log("Wrapping Token:", token);
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

      // Obtain name from defaultTokenInfo
      for (const token in tokensMarketInfo) {
        if (tokensMarketInfo[token].name) continue;

        const tokenInfo = defaultTokensInfo.find((t) => t.symbol === token);
        if (tokenInfo) {
          tokensMarketInfo[token].name = tokenInfo.name;
        } else {
          // If tokenInfo is not found, try to get name from the ERC20 contract
          const tokenInfo = userTokens.find((t) => t.symbol === token);
          if (tokenInfo) {
            tokensMarketInfo[token].name = tokenInfo.name;
          }
        }
      }

      // Obtain logoUrl
      for (const token in tokensMarketInfo) {
        if (tokensMarketInfo[token].logoUrl) {
          console.log(
            "Token:",
            token,
            "LogoUrl:",
            tokensMarketInfo[token].logoUrl
          );
          continue;
        }

        const tokenInfo = defaultTokensInfo.find((t) => t.symbol === token);
        if (tokenInfo) {
          tokensMarketInfo[token].logoUrl = tokenInfo.logo_url;
          tokensMarketInfo[token].cmcUrl = tokenInfo.cmc_url;
        } else {
          // If tokenInfo is not found, try to get name from the ERC20 contract
          const tokenInfo = userTokens.find((t) => t.symbol === token);
          if (tokenInfo) {
            tokensMarketInfo[token].name = tokenInfo.name;
          }
        }
      }

      // Obtain cmcUrl
      for (const token in tokensMarketInfo) {
        if (tokensMarketInfo[token].cmcUrl) {
          console.log(
            "Token:",
            token,
            "CmcUrl:",
            tokensMarketInfo[token].cmcUrl
          );
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
