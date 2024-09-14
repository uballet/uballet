import { useMutation } from "@tanstack/react-query";
import uballet from "../../api/uballet";
import { Address } from "viem";
import { useAccountContext } from "../useAccountContext";

export function useJoinRecoveryTeam() {
    const { account } = useAccountContext()
    const mutation = useMutation({
        mutationFn: async ({ teamId }: { teamId: string }) => {
            const address = await account!.account.getSigner().getAddress()
            const data = await uballet.recovery.joinRecoveryTeam({ recoveryTeamId: teamId, address })
            return data
        }
    })

    return mutation
}