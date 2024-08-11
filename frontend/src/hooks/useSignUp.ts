import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../providers/AuthProvider";
import { useEffect } from "react";
import UballetAPI from '../api/uballet'

export function useSignUp() {
    const { setUser } = useAuthContext()
    const { mutate: signup, isPending, isError, error, isSuccess, data: user } = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            const { data: user } = await UballetAPI.signUp({ email })
            return user
        }
    })

    useEffect(() => {
        if (user) {
            setUser(user)
        }
    }, [user])

    useEffect(() => {
        if (error) {
            console.error(error)
        }
    }, [error])
    return { signup, isPending, isError, isSuccess }
}