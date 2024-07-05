import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useCallback } from "react"
import { UBALLET_API_URL } from "../constants"
import { Passkey, PasskeyAuthenticationResult } from "react-native-passkey"
import base64url from "base64url"
import { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types'

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
        const { data: options } = await axios.get(`${UBALLET_API_URL}/passkey-authentication-options`)
            const challenge = options.challenge
            const formattedOptions = serverToClientPasskeyAuthenticationnOptions(options)
            const cred = await Passkey.authenticate(formattedOptions as any, {
                withSecurityKey: false
            })
            const credentials = clientToServerCredentialsResponse(cred)

            const verificationResponse = await axios.post(`${UBALLET_API_URL}/verify-passkey-authentication`, { credentials, challenge })

            return verificationResponse
    }, [])

    const { mutate: signIn, isError, isSuccess, isPending } = useMutation({
        mutationFn: signInCb
    })

    return { signIn, isError, isSuccess, isPending }
}