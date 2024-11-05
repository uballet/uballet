import { useMutation } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"
import { Passkey, PasskeyAuthenticationResult } from "react-native-passkey"
import base64url from "base64url"
import { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types'
import uballet from "../api/uballet"
import { useAuthContext } from "../providers/AuthProvider"
import { setUballetToken } from "../api/uballet"

const serverToClientPasskeyAuthenticationnOptions = (options: PublicKeyCredentialRequestOptionsJSON) => {
    return {
        ...options,
        challenge: base64url.toBase64(options.challenge),
    }
}

const clientToServerCredentialsResponse = (result: PasskeyAuthenticationResult) => {
    return {
        id: base64url.fromBase64(result.id),
        rawId: base64url.fromBase64(result.rawId),
        response: {
            ...result.response,
            clientDataJSON: base64url.fromBase64(result.response.clientDataJSON),
            authenticatorData: base64url.fromBase64(result.response.authenticatorData),
            signature: base64url.fromBase64(result.response.signature),                
        },
        type: 'public-key',
        clientExtensionResults: {}
    }
}

export function usePasskeySignIn() {
    const signInCb = useCallback(async () => {
        const options = await uballet.getPasskeyAuthenticationOptions()
        const challenge = options.challenge
        const formattedOptions = serverToClientPasskeyAuthenticationnOptions(options)
        const cred = await Passkey.authenticate(formattedOptions as any, {
            withSecurityKey: false
        })
        const credentials = clientToServerCredentialsResponse(cred)
        const { user, token }  = await uballet.verifyPasskeyAuthentication({ credentials, challenge })
        await setUballetToken(token)
        return user
    }, [])

    const { mutate: signIn, isError, isSuccess, isPending, data: user } = useMutation({
        mutationFn: signInCb
    })
    const { setUser } = useAuthContext()

    useEffect(() => {
        if (user) {
            setUser(user)
        }
    }, [user])

    return { signIn, isError, isSuccess, isPending, isSupported: Passkey.isSupported() }
}