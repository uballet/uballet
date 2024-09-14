import { useMutation } from "@tanstack/react-query";
import uballet from "../../api/uballet"
import { useEffect } from "react";

export function useCreateRecoveryTeam() {
    const mutation = useMutation({
        mutationFn: async ({ email1, email2 }: { email1: string; email2: string }) => {
            await uballet.recovery.createRecoveryTeam({ recoverer1Email: email1, recoverer2Email: email2 })
        }
    })

    return mutation
}