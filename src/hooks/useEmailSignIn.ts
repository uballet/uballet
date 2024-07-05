import { useCallback, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function useEmailSignIn() {
    const { mutate: login, isError, isSuccess, isPending } = useMutation({ mutationFn: ({ email }: { email: string }) => {
        return axios.post(`${process.env.UBALLET_API_URL}/email-login`, { email })
    } })

    return { login, isError, isSuccess, isPending }
}