import { useCallback, useState } from "react";
import { useSafeLightAccount } from "./useLightAccount";
import { useAccountContext } from "./useAccountContext";
import { parseEther } from "viem";

export function useCheckTransferSponsorship() {
    const [isSponsored, setIsSponsored] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(false)
    const account = useSafeLightAccount()
    const { client } = useAccountContext()
    const checkTransferSponsorship = useCallback(async (address: `0x${string}`, etherAmount: string) => {
        setLoading(true)
        setIsSponsored(null)
        try {
            const check = await client.checkGasSponsorshipEligibility({
                account,
                uo: {
                    target: address,
                    data: '0x',
                    value: parseEther(etherAmount)
                }
            })
            setIsSponsored(check)
        } catch(e) {
            console.error({ error: e })
        } finally {
            setLoading(false)
        }
    }, [account])


    console.log({ loading, isSponsored })
    return {
        loading,
        isSponsored,
        setIsSponsored,
        checkTransferSponsorship
    }
}