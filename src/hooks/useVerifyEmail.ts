import { useMutation } from "@tanstack/react-query"
import { useAuthContext } from "../providers/AuthProvider"
import { useEffect } from "react"
import uballet from "../api/uballet"

export function useVerifyEmail() {
    const { user, setUser } = useAuthContext()
    const { mutate: verifyEmail, isPending, isError, isSuccess } = useMutation({
        mutationFn: async ({ code }: { code: string }) => {
            await uballet.verifyEmail({ email: user!.email, code })
            return true
        },
        mutationKey: ['verify-email', user?.email]
    })

    useEffect(() => {
        if (isSuccess) {
            setUser({ ...user!, verified: true })
        }
    }, [isSuccess])

    return { verifyEmail, isPending, isSuccess, isError }
}