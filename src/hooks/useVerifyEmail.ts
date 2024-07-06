import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useAuthContext } from "../providers/AuthProvider"
import { useEffect } from "react"
import { UBALLET_API_URL } from "../constants"

export function useVerifyEmail() {
    const { user, setUser } = useAuthContext()
    const { mutate: verifyEmail, isPending, isError, isSuccess } = useMutation({
        mutationFn: async ({ code }: { code: string }) => {
            const { data } = await axios.post(`${UBALLET_API_URL}/verify-email`, { email: user?.email, code })
            console.log({ data })
            return data
        },
        mutationKey: ['verify-email', user?.email]
    })

    useEffect(() => {
        console.log({ isSuccess})
        if (isSuccess) {
            setUser({ ...user!, verified: true })
        }
    }, [isSuccess])

    return { verifyEmail, isPending, isSuccess, isError }
}