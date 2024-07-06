import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../providers/AuthProvider";
import { useEffect } from "react";
import { UBALLET_API_URL } from "../constants";

export function useSignUp() {
    const { setUser } = useAuthContext()
    const { mutate: signup, isPending, isError, isSuccess, data } = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            return axios.post(`${UBALLET_API_URL}/signup`, { email })
        }
    })

    useEffect(() => {
        if (data?.data) {
            console.log({ data: data.data })
            setUser(data.data.user)
        }
    }, [data])

    return { signup, isPending, isError, isSuccess }
}