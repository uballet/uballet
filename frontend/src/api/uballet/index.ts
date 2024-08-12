import axios from "axios"
import { UBALLET_API_URL } from "../../env"
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types"
import { PasskeyAuthenticationResult, PasskeyRegistrationResult } from "react-native-passkey"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Contact, type User, type UserAndToken, type UserPasskey } from "./types"

const uballetAxios = axios.create({
    baseURL: UBALLET_API_URL,
})

uballetAxios.interceptors.request.use(async (config) => {
    const token = await getUballetToken()
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
}, error => Promise.reject(error))

const UBALLET_JWT_KEY = 'uballet_jwt'

export const getUballetToken = async () => {
    const token = await AsyncStorage.getItem(UBALLET_JWT_KEY)
    return token
}

export const setUballetToken = async (token: string) => {
    return await AsyncStorage.setItem(UBALLET_JWT_KEY, token)
}

export const removeUballetToken = async () => {
    return await AsyncStorage.removeItem(UBALLET_JWT_KEY)
}

const signUp = ({ email }: { email: string }) => {
    return uballetAxios.post<User>(`/signup`, { email })
}

const verifyEmail = async ({ email, code }: { email: string, code: string }) => {
    const { data: { token, ...user } } = await uballetAxios.post<UserAndToken>(`/verify-email`, { email, code })

    return {
        user,
        token
    }
}

const getPasskeyRegistrationOptions = async ({ userId }: { userId: string }) => {
    const { data: options } = await uballetAxios.get<PublicKeyCredentialCreationOptionsJSON>(`/passkey-registration-options`, { params: { userId } })
    return options
}

const verifyPasskeyRegistration = async ({ userId, credentials, challenge }: { userId: string, credentials: PasskeyRegistrationResult, challenge: string }) => {
    const { data: passkey } = await uballetAxios.post<UserPasskey>(`/verify-passkey-registration`, { userId, credentials, challenge })
    return passkey
}

const getPasskeyAuthenticationOptions = async () => {
    const { data: options } = await uballetAxios.get<PublicKeyCredentialCreationOptionsJSON>(`/passkey-authentication-options`)
    return options
}

const verifyPasskeyAuthentication = async ({ credentials, challenge }: { credentials: PasskeyAuthenticationResult, challenge: string }) => {
    const { data: { token, ...user} } = await uballetAxios.post<UserAndToken>(`/verify-passkey-authentication`, { credentials, challenge })
    return { user, token }
}

const getUserPasskeys = async ({ userId }: { userId: string }) => {
    const { data: passkeys } = await uballetAxios.get<UserPasskey[]>(`/passkeys`, { params: { userId } })
    return passkeys
}

const startEmailLogin = async ({ email }: { email: string }) => {
    await uballetAxios.post(`/email-sign-in`, { email })
}

const getCurrentUser = async () => {
    const { data: user } = await uballetAxios.get<User>(`/user`)
    return user
}

const completeSignIn = async ({ email, code}: { email: string, code: string }) => {
    const { data: { token, ...user } } = await uballetAxios.post<UserAndToken>(`/complete-sign-in`, { email, code })
    return {
        token,
        user
    }
}

async function getContacts() {
    const { data } = await uballetAxios.get<Contact[]>('/contacts')
    return data
}

async function addContact({ name, address }: { name: string, address: string }) {
    const { data } = await uballetAxios.post<Contact>('/contacts', { name, address })
    return data
}

export default {
    addContact,
    completeSignIn,
    getPasskeyAuthenticationOptions,
    getPasskeyRegistrationOptions,
    getContacts,
    getCurrentUser,
    getUserPasskeys,
    signUp,
    startEmailLogin,
    verifyEmail,
    verifyPasskeyRegistration,
    verifyPasskeyAuthentication,
}