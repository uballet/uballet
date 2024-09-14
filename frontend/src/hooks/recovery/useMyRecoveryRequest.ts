import { useQuery } from "@tanstack/react-query"
import uballet from "../../api/uballet"

export function useMyRecoveryRequest() {
    const query = useQuery({
        queryKey: ['my-recovery-request'],
        queryFn: async () => {
            const recoveryRequest = await uballet.recovery.getMyRecoveryRequest()
            return recoveryRequest
        }
    })

    return query
}