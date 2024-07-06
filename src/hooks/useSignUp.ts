import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../providers/AuthProvider";
import { useEffect } from "react";
import UballetAPI from '../api/uballet'

export function useSignUp() {
    const { setUser } = useAuthContext()
    const { mutate: signup, isPending, isError, isSuccess, data: user } = useMutation({
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

    return { signup, isPending, isError, isSuccess }
}