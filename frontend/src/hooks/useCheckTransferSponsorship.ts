import { useCallback, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { parseEther } from "viem";

export function useCheckTransferSponsorship() {
    const [isSponsored, setIsSponsored] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(false)
    const { lightAccount, initiator } = useAccountContext()
    const account = initiator || lightAccount
    const checkTransferSponsorship = useCallback(async (address: `0x${string}`, etherAmount: string) => {
        setLoading(true)
        setIsSponsored(null)
        try {
            const check = await account!.checkGasSponsorshipEligibility({
                uo: {
                    target: address,
                    data: '0x',
                    value: parseEther(etherAmount)
                }
            })
            setIsSponsored(!!check)
        } catch(e) {
            console.error({ error: e })
        } finally {
            setLoading(false)
        }
    }, [account])

    return {
        loading,
        isSponsored,
        setIsSponsored,
        checkTransferSponsorship
    }
}