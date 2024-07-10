import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { secp256k1 } from '@noble/curves/secp256k1'
import "node-libs-react-native/globals.js";
import "react-native-get-random-values";
import uballet from "../api/uballet";

export async function setEncryptionKey(privOrPub: 'pub' | 'priv', key: Uint8Array) {
    return AsyncStorage.setItem(`p256_${privOrPub}`, Buffer.from(key).toString('hex'))
}

export async function getEncryptionKey(privOrPub: 'pub' | 'priv'): Promise<Uint8Array> {
    const hexString = await AsyncStorage.getItem(`p256_${privOrPub}`)
    return Uint8Array.from(Buffer.from(hexString!!, 'hex'))
}

export function useEmailSignIn() {
    const startEmailSignIn = useCallback(async ({ email }: { email: string }) => {
        try {
            const priv = secp256k1.utils.randomPrivateKey();
            const pub = secp256k1.getPublicKey(priv);

            await Promise.all([
                setEncryptionKey('priv', priv),
                setEncryptionKey('pub', pub)
            ])
            const targetPublicKey = Buffer.from(pub).toString('base64')
            await uballet.startEmailLogin({ email, targetPublicKey })
        } catch (error) {
            console.error(error)
        }
    }, [])

    const { mutate: signIn, isError, isSuccess, isPending } = useMutation({
        mutationFn: startEmailSignIn
    })

    return { signIn, isError, isSuccess, isPending }
}