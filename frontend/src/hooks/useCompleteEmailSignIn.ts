import base64url from "base64url";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from 'react';
import { useAuthContext } from '../providers/AuthProvider';
import { getEncryptionKey } from "./useEmailSignIn";
import { secp256k1 } from '@noble/curves/secp256k1'
import uballet, { setUballetToken } from "../api/uballet";
import { gcm } from '@noble/ciphers/aes';
import { sha256 } from '@noble/hashes/sha256';


const decodeHexCode = async (hexCode: string) => {
    const privKey = await getEncryptionKey('priv')
    if (!privKey) {
        throw new Error('No private key found')
    }

    const pubKeyHex = hexCode.slice(0, 66)
    const nonceHex = hexCode.slice(66)
    

    const pubKey = new Uint8Array(Buffer.from(pubKeyHex, 'hex'))
    const secret = secp256k1.getSharedSecret(privKey, pubKey)

    const nonce = new Uint8Array(Buffer.from(nonceHex, 'hex'))

    return { secret, nonce }
}

export function useCompleteEmailSignIn() {
    const completeCb = useCallback(async ({ email, code  }: { email: string, code: string }) => {
        // const { secret, nonce } = await decodeHexCode(hexCode)
        // const secretHash = sha256(secret)
        // const aes = gcm(secretHash, nonce);
        // const encryptedEmail = aes.encrypt(new Uint8Array(Buffer.from(email, 'utf-8')))
        // const stampedEmail = Buffer.from(encryptedEmail).toString('base64')


        const { token, user } = await uballet.completeSignIn({ email, code })
        await setUballetToken(token)
        return user
    }, [])

    const { mutate: complete, isError, isSuccess, isPending, data: user } = useMutation({
        mutationFn: completeCb
    })

    const { setUser } = useAuthContext()

    useEffect(() => {
        if (user) {
            setUser(user)
        }
    }, [user])

    return { complete, isError, isSuccess, isPending }
}