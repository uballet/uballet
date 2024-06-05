import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { useSafeLightAccount } from "./useLightAccount";
import { formatEther } from "viem";

export function useBalance() {
    const account = useSafeLightAccount()
    const { client } = useAccountContext()
    const [balance, setBalance] = useState<string | null>(null)

    useEffect(() => {
        client.getBalance({ address: account.address }).then(b => setBalance(
            formatEther(b)
        ))
    }, [])

    return balance
}