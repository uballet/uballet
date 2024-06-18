import { useCallback, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { useSafeLightAccount } from "./useLightAccount";
import { parseEther } from "viem";

export function useTransfer() {
    const account = useSafeLightAccount();
    const { client } = useAccountContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const [txHash, setTxHash] = useState<null | string>(null)
    const transferToAddress = useCallback(async (address: `0x${string}`, etherAmount: string) => {
        try {
            setLoading(true)
            const uo = await client.sendUserOperation({
                account,
                uo: {
                    target: address,
                    data: '0x',
                    value: parseEther(etherAmount)
                },
            })
            const txHash = await client.waitForUserOperationTransaction(uo)
            setTxHash(txHash)
        } catch(e) {
            console.error({ error: e })
            setError(true)
        } finally {
            setLoading(false)
        }
    }, [account])

    return {
        transferToAddress,
        txHash,
        error,
        loading
    }
}