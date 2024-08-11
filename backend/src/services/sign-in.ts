import { User } from "../entity/User";
import { Stamper } from "../entity/Stamper";
import EncryptionService from "./encrypt";
import { MoreThan } from "typeorm";
import { createAccessToken } from "./token";
import { secp256k1 } from '@noble/curves/secp256k1'
import { randomBytes } from '@noble/ciphers/webcrypto';
import EmailService from './email'
import { gcm } from '@noble/ciphers/aes';
import { sha256 } from '@noble/hashes/sha256';
import { createEmailVerificationCode } from "./sign-up";
import { EmailVerificationCode } from "../entity/EmailVerificationCode";

function encryptStamperValues({ secret, nonce }: { secret: Uint8Array, nonce: Uint8Array }) {
    const nonceHex = Buffer.from(nonce).toString('hex')
    const secretHex = Buffer.from(secret).toString('hex')
    const toEncrypt = `${secretHex}${nonceHex}`
    return EncryptionService.encryptValue(toEncrypt)
}

function decryptStamperValues(stamperValue: string): { secret: Uint8Array, nonce: Uint8Array } {
    const decryptedValue = EncryptionService.decryptValue(stamperValue)
    const secret = new Uint8Array(Buffer.from(decryptedValue.slice(0, 66), 'hex'))
    const nonce = new Uint8Array(Buffer.from(decryptedValue.slice(66), 'hex'))
    return { secret, nonce }
}

async function signInWithEmail({ email, targetPublicKey: targetPublicKeyBase64 }: { email: string, targetPublicKey: string }) {
    const user = await User.findOneOrFail({ where: { email } })
    await Stamper.delete({ userId: user.id })
    const priv = secp256k1.utils.randomPrivateKey()
    const pub = secp256k1.getPublicKey(priv)

    const nonce = randomBytes(24)
    const nonceHex = Buffer.from(nonce).toString('hex')
    const pubKeyHex = Buffer.from(pub).toString('hex')
    const targetPublicKey = new Uint8Array(Buffer.from(targetPublicKeyBase64, 'base64'))

    const sharedSecret = secp256k1.getSharedSecret(priv, targetPublicKey)
    const stamper = new Stamper()
    stamper.userId = user.id
    stamper.expiresAt = new Date(Date.now() + 1000 * 60 * 1000);
    stamper.value = encryptStamperValues({ secret: sharedSecret, nonce })

    await stamper.save();
    if (process.env.BUILD_ENV === 'testing') {
        await EmailService.sendEmail(email, 'UBALLET - Sign In Code', `Sign In With the Following Code: ${pubKeyHex+nonceHex}`)
    }
}

async function signInWithEmailSimpler({ email }: { email: string }) {
    const user = await User.findOneOrFail({ where: { email } })

    await createEmailVerificationCode(user.id, 'login')
}

async function completeSimplerEmailSignIn({ email, code }: { email: string, code: string }) {
    const user = await User.findOneOrFail({ where: { email } })
    await EmailVerificationCode.findOneOrFail({ where: { userId: user.id, code, type: 'login' } })

    const token = createAccessToken(user.id)
    return { user, token }
}

const completeEmailSignIn = async ({ email, stampedEmail }: { email: string, stampedEmail: string }) => {
    const user = await User.findOneOrFail({ where: { email } })
    const stamper = await Stamper.findOneOrFail({ where: { userId: user.id, expiresAt: MoreThan(new Date()) }})
    const { secret, nonce } = decryptStamperValues(stamper.value)
    const secretHash = sha256(secret)
    const aes = gcm(secretHash, nonce)

    const decryptBuf = new Uint8Array(Buffer.from(stampedEmail, 'base64'))
    const decryptedEmail = aes.decrypt(decryptBuf)

    const decryptedEmailString = Buffer.from(decryptedEmail).toString('utf-8')


    if (decryptedEmailString !== email) {
        throw new Error('Invalid email')
    }
    const token = createAccessToken(user.id)
    return { user, token }
}

export default {
    signInWithEmail,
    signInWithEmailSimpler,
    completeEmailSignIn,
    completeSimplerEmailSignIn
}