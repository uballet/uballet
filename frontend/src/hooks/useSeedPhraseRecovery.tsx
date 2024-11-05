import { useAccountContext } from "./useAccountContext"
import { useMutation } from "@tanstack/react-query"

export function useSeedPhraseRecovery() {
    const {recoverWithSeedPhrase } = useAccountContext()
    const { mutate: recover, isPending, isSuccess, isError  } = useMutation({
        mutationFn: async ({ code }: { code: string }) => {
            await recoverWithSeedPhrase(code)
        },
        mutationKey: ['recover-seed-phrase']
    })
    
    return {
        recover,
        isPending,
        isSuccess,
        isError
    }
}