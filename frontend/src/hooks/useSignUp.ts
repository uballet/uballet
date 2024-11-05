import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../providers/AuthProvider";
import { useEffect } from "react";
import UballetAPI from '../api/uballet'

export function useSignUp() {
    const { setUser } = useAuthContext()
    const { mutate: signup, isPending, isError, error, isSuccess, data: user } = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            const trimmedEmail = email.trim()
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            
            if (!emailRegex.test(trimmedEmail)) {
                throw new Error('Please enter a valid email address')
            }
            
            const { data: user } = await UballetAPI.signUp({ email: trimmedEmail })
            return user
        }
    })

    useEffect(() => {
        if (user) {
            setUser(user)
        }
    }, [user])

    return { signup, isPending, isError, error }
}