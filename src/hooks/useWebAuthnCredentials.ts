import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../providers/AuthProvider";
import { UBALLET_API_URL } from "../constants";
import { useEffect } from "react";

export function useWebAuthnCredentials() {
    const { user } = useAuthContext()
    const { skipPasskeys, passkeysOnboarded } = useAuthContext()
    const { data: credentials, isLoading, isError, isSuccess } = useQuery({
        queryFn: async () => {
            console.log({ userId: user?.id })
            const creds = await axios.get(`${UBALLET_API_URL}/passkey-credentials`, { params: { userId: user?.id } })
            return creds.data as any[]
        },
        queryKey: ['passkey-credentials', user?.id],
        enabled: !!user
    })

    useEffect(() => {
        if (isSuccess && !credentials) {
            skipPasskeys();
        }
    }, [isSuccess])

    return {
        credentials,
        isLoading,
        isError,
        isSuccess,
        passkeysOnboarded
    }
}
