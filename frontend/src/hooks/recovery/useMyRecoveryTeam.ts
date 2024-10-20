import { useQuery } from "@tanstack/react-query"
import uballet from "../../api/uballet"

export function useMyRecoveryTeam() {
    const query = useQuery({
        queryKey: ['my-recovery-team'],
        refetchInterval: 5000,
        queryFn: async () => {
            const recoveryTeam = await uballet.recovery.getMyRecoveryTeam()
            return recoveryTeam
        }
    })

    return query
}