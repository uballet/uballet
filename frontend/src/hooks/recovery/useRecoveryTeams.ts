import { useQuery } from "@tanstack/react-query";
import uballet from "../../api/uballet";

export function useRecoveryTeams() {
    const query = useQuery({
        queryKey: ['recovery-teams'],
        refetchInterval: 5000,
        queryFn: async () => {
            const recoveryTeams = await uballet.recovery.getRecoveryTeams()
            const joined = recoveryTeams.filter(team => team.joined)
            const notJoined = recoveryTeams.filter(team => !team.joined)
            const confirmed = recoveryTeams.filter(team => team.confirmed)
            return { joined, notJoined, confirmed }
        }
    })
    return query
}