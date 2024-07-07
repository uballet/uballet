import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import uballet from "../api/uballet";

export function useEmailSignIn() {
    const startEmailSignIn = useCallback(async ({ email }: { email: string }) => {
        await uballet.startEmailLogin({ email })
    }, [])

    const { mutate: signIn, isError, isSuccess, isPending } = useMutation({
        mutationFn: startEmailSignIn
    })

    return { signIn, isError, isSuccess, isPending }
}