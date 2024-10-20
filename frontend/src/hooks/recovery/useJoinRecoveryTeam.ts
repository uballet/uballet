import { useMutation, useQueryClient } from "@tanstack/react-query";
import uballet from "../../api/uballet";
import { useAccountContext } from "../useAccountContext";

export function useJoinRecoveryTeam() {
    const { lightAccount, initiator } = useAccountContext()
    const client = useQueryClient()
    const account = lightAccount || initiator
    const mutation = useMutation({
        mutationFn: async ({ teamId }: { teamId: string }) => {
            const address = await account!.account.getSigner().getAddress()
            const data = await uballet.recovery.joinRecoveryTeam({ recoveryTeamId: teamId, address })
            return data
        },
        onSuccess: () => {
            client.refetchQueries({ queryKey: ['recovery-teams'] })
            client.refetchQueries({ queryKey: ['my-recovery-team'] })
        }
    })

    return mutation
}