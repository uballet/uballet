import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { formatEther } from "viem";

export function useBalance() {
    const { account } = useAccountContext()
    const [balance, setBalance] = useState<string | null>(null)

    useEffect(() => {
        account?.getBalance({ address: account.getAddress() }).then(b => setBalance(
            formatEther(b)
        ))
    }, [])

    return balance
}