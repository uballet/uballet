import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { ethers } from "ethers";
import config from "../../netconfig/blockchain.default.json";

interface TokenBalances {
  [key: string]: string; // Adjust the type as needed
}

export function useTokenBalance() {
  const { client, sdkClient, account } = useAccountContext();
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({});

  const tokens = config.sepolia.erc20_tokens;

  if (!account) {
    throw new Error("Account not ready");
  }

  useEffect(() => {
    const fetchTokenBalances = async () => {
      const balances: TokenBalances = {};

      for (const token of tokens) {
        const balance = await sdkClient.core.getTokenBalances(account.address, [
          token.address,
        ]);
        const tokenBalance = balance.tokenBalances[0]?.tokenBalance;

        if (tokenBalance && tokenBalance !== "0") {
          balances[token.symbol] = ethers.formatUnits(tokenBalance, 18); // Format the balance to a readable format
        }
      }

      setTokenBalances(balances);
    };

    if (account.address) {
      fetchTokenBalances();
    }
  }, [account.address, sdkClient]);

  // Return a mock balance for testing
  return {
    DAI: "100",
    USDT: "200",
    USDC: "350",
  };
  return tokenBalances;
}
