import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { useLightAccount, useSafeLightAccount } from "./useLightAccount";

export function useBalance() {
    const account = useSafeLightAccount()
    const { client } = useAccountContext()
    const [balance, setBalance] = useState<bigint | null>(null)

    useEffect(() => {
        client.getBalance({ address: account.address }).then(b => setBalance(b))
    }, [])

    return balance
}