import { useMutation } from "@tanstack/react-query"
import { useAuthContext } from "../providers/AuthProvider"
import { useEffect } from "react"
import uballet, { setUballetToken } from "../api/uballet"

export function useVerifyEmail() {
    const { user, setUser } = useAuthContext()
    const { mutate: verifyEmail, isPending, isError, isSuccess, data } = useMutation({
        mutationFn: async ({ code }: { code: string }) => {
            const { token } = await uballet.verifyEmail({ email: user!.email, code })
            await setUballetToken(token)
            return true
        },
        mutationKey: ['verify-email', user?.email]
    })

    useEffect(() => {
        if (data) {
            setUser({ ...user!, verified: true })
        }
    }, [data])

    return { verifyEmail, isPending, isSuccess, isError }
}