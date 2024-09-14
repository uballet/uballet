import { useMutation, useQueryClient } from "@tanstack/react-query";
import uballet from "../../api/uballet";
import { useEffect } from "react";
import { generateMnemonic } from "bip39";
import { useSignerStore } from "../useSignerStore";
import { useBalance } from "../useBalance";
import { useAuthContext } from "../../providers/AuthProvider";

export function useRequestRecovery() {
    const client = useQueryClient();
    const { user } = useAuthContext();
    const { storeRecoverySeedphrase, loadRecoverySigners } = useSignerStore()
    const mutation = useMutation({
        mutationFn: async () => {
            let recoverySigners = await loadRecoverySigners();
            if (!recoverySigners) {
                const recoveryMnemonic = generateMnemonic();
                recoverySigners = await storeRecoverySeedphrase(recoveryMnemonic);
            }
            const [address1, address2] = await Promise.all(recoverySigners.map(signer => signer.getAddress()))
            const data = await uballet.recovery.requestRecovery({ address1, address2 })
            return data
        },
        mutationKey: ['request-recovery', loadRecoverySigners],
    })
    useEffect(() => {
        if (mutation.isSuccess) {
            client.invalidateQueries({ queryKey: ['my-recovery-request'] })
        }
    }, [mutation.isSuccess])
    return mutation
}