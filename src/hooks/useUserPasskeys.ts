import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../providers/AuthProvider";
import uballet from "../api/uballet";

export type UserPasskey = {
    id: string
    name: string
    registeredAt: Date
}

export function useUserPasskeys() {
    const { user } = useAuthContext()
    const { passkeysOnboarded } = useAuthContext()
    const { data: passkeys, isLoading, isError, isSuccess } = useQuery({
        queryFn: async () => {
            const passkeys = await uballet.getUserPasskeys({ userId: user?.id!! })
            return passkeys
        },
        queryKey: ['passkeys', user?.id],
        enabled: !!user
    })

    return {
        passkeys,
        isLoading,
        isError,
        isSuccess,
        passkeysOnboarded
    }
}
