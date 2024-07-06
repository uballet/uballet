import axios from "axios";
import { useCallback, useEffect } from "react";
import { UBALLET_API_URL } from "../constants";
import base64url from "base64url";
import { Passkey, type PasskeyRegistrationResult } from "react-native-passkey";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../providers/AuthProvider";
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types'

const serverToClientPasskeyRegistrationOptions = (options: PublicKeyCredentialCreationOptionsJSON) => {
    return {
        ...options,
        challenge: base64url.toBase64(options.challenge),
    }
}

const clientToServerCredentialsResponse = (result: PasskeyRegistrationResult) => {
    return {
        ...result,
        id: base64url.fromBase64(result.id),
        rawId: base64url.fromBase64(result.rawId),
        response: {
            ...result.response,
            attestationObject: base64url.fromBase64(result.response.attestationObject),
            clientDataJSON: base64url.fromBase64(result.response.clientDataJSON),
        },
        type: 'public-key',
        clientExtensionResults: {}
    }
}

export function usePasskeyRegistration() {
    const { user, skipPasskeys } = useAuthContext()
    const registerCb = useCallback(async () => {
        console.log('HERE')
        const { data: options }  = await axios.get(`${UBALLET_API_URL}/passkey-registration-options`, { params: { userId: user?.id } })
        const formattedOptions = serverToClientPasskeyRegistrationOptions(options)

        const challenge = options.challenge
        // @ts-expect-error
        const result = await Passkey.register(formattedOptions)

        const credentials = clientToServerCredentialsResponse(result)
        const registration = await axios.post(`${UBALLET_API_URL}/verify-passkey-registration`, { userId: user?.id, credentials, challenge })
        return registration
    }, [user?.id])

    const { mutate: register, isError, isSuccess, isPending } = useMutation({
        mutationFn: registerCb,
        mutationKey: ['register', user?.id],
    })

    useEffect(() => {
        if (isSuccess) {
            skipPasskeys()
        }
    }, [isSuccess])

    console.log({ isError, isPending, isSuccess })

    return { register, isError, isSuccess, isPending }
}