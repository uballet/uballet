import { useCallback } from "react";
import base64url from "base64url";
import { Passkey, type PasskeyRegistrationResult } from "react-native-passkey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../providers/AuthProvider";
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types'
import uballet from "../api/uballet";

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
    const { user } = useAuthContext()
    const queryClient = useQueryClient();

    const registerCb = useCallback(async () => {
        const options  = await uballet.getPasskeyRegistrationOptions({ userId: user?.id!! })
        const formattedOptions = serverToClientPasskeyRegistrationOptions(options)
        const challenge = options.challenge
        // @ts-expect-error
        const result = await Passkey.register(formattedOptions)

        const credentials = clientToServerCredentialsResponse(result)
        const passkey = await uballet.verifyPasskeyRegistration({ userId: user?.id!!, credentials, challenge })
        return passkey
    }, [user?.id])

    const { mutate: register, isError, isSuccess, isPending } = useMutation({
        mutationFn: registerCb,
        mutationKey: ['register', user?.id],
        onSuccess: async (passkey) => {
            queryClient.setQueryData(['passkeys', user?.id], passkey)
        }
    })

    return { register, isError, isSuccess, isPending }
}