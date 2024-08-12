import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { ethers } from "ethers";

const tokens = [
    {
        name: "DAI",
        symbol: "DAI",
        address: "0xf5c142292B85253e4D071812c84f05ec42828fdB",
        cmcid: "4945"
    },
    {
        name: "Tether USD",
        symbol: "USDT",
        address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0"
    },
    {
        name: "USD Coin",
        symbol: "USDC",
        address: "0x73d219B3881E481394DA6B5008A081d623992200"
    }
];

interface TokenBalances {
    [key: string]: string; // Adjust the type as needed
}

export function useTokenBalance() {
    const { client, sdkClient, account } = useAccountContext();
    const [tokenBalances, setTokenBalances] = useState<TokenBalances>({});

    if (!account) {
        throw new Error('Account not ready');
    }

    useEffect(() => {
        const fetchTokenBalances = async () => {
            const balances: TokenBalances = {};

            for (const token of tokens) {
                const balance = await sdkClient.core.getTokenBalances(account.address, [token.address]);
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

    return tokenBalances;
}
