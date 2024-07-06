import axios, { AxiosResponse } from "axios"
import { UBALLET_API_URL } from "../constants"
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types"
import { PasskeyAuthenticationResult, PasskeyRegistrationResult } from "react-native-passkey"
import { UserPasskey } from "../hooks/useUserPasskeys"

const withData = async (resultPromise: Promise<AxiosResponse>) => {
    const res = await resultPromise

    return res.data
}

const signUp = ({ email }: { email: string }) => {
    return axios.post<{ id: string, email: string, verified: boolean }>(`${UBALLET_API_URL}/signup`, { email })
}

const verifyEmail = ({ email, code }: { email: string, code: string }) => {
    return axios.post(`${UBALLET_API_URL}/verify-email`, { email, code })
}

const getPasskeyRegistrationOptions = async ({ userId }: { userId: string }) => {
    const { data: options } = await axios.get<PublicKeyCredentialCreationOptionsJSON>(`${UBALLET_API_URL}/passkey-registration-options`, { params: { userId } })
    return options
}

const verifyPasskeyRegistration = async ({ userId, credentials, challenge }: { userId: string, credentials: PasskeyRegistrationResult, challenge: string }) => {
    const { data: passkey } = await axios.post<UserPasskey>(`${UBALLET_API_URL}/verify-passkey-registration`, { userId, credentials, challenge })
    return passkey
}

const getPasskeyAuthenticationOptions = async () => {
    const { data: options } = await axios.get<PublicKeyCredentialCreationOptionsJSON>(`${UBALLET_API_URL}/passkey-authentication-options`)
    return options
}

const verifyPasskeyAuthentication = async ({ credentials, challenge }: { credentials: PasskeyAuthenticationResult, challenge: string }) => {
    const { data: user } = await axios.post<{ id: string, email: string, verified: boolean }>(`${UBALLET_API_URL}/verify-passkey-authentication`, { credentials, challenge })
    return user
}

const getUserPasskeys = async ({ userId }: { userId: string }) => {
    const { data: passkeys } = await axios.get<UserPasskey[]>(`${UBALLET_API_URL}/passkeys`, { params: { userId } })
    return passkeys
}

const startEmailLogin = async ({ email }: { email: string }) => {
    await axios.post(`${UBALLET_API_URL}/email-login`, { email })
}

export default {
    getPasskeyAuthenticationOptions,
    getPasskeyRegistrationOptions,
    getUserPasskeys,
    signUp,
    startEmailLogin,
    verifyEmail,
    verifyPasskeyRegistration,
    verifyPasskeyAuthentication,
}