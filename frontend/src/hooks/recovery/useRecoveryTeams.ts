import { useQuery } from "@tanstack/react-query";
import uballet from "../../api/uballet";

export function useRecoveryTeams() {
    const query = useQuery({
        queryKey: ['recovery-teams'],
        queryFn: async () => {
            const recoveryTeams = await uballet.recovery.getRecoveryTeams()
            console.log({ recoveryTeams })
            const joined = recoveryTeams.filter(team => team.joined)
            const notJoined = recoveryTeams.filter(team => !team.joined)
            const confirmed = recoveryTeams.filter(team => team.confirmed)
            return { joined, notJoined, confirmed }
        }
    })
    console.log({ error: query.error, data: query.data })
    return query
}