import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from "@simplewebauthn/server";
import { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/typescript-types'
import { User } from "../entity/User";
import { PasskeyChallenge } from "../entity/PasskeyChallenge";
import base64url from "base64url";
import { Passkey } from "../entity/Passkey";
import { createAccessToken } from "./token";

async function getRegistrationOptions(userId: string) {
    const user = await User.findOneOrFail({ where: { id: userId } })
    const options = await generateRegistrationOptions({
        rpName: 'uballet',
        rpID: process.env.WEBAUTHN_RP_ID!!,
        userDisplayName: user.email,
        userName: 'uballet-user',
        attestationType: 'none',
        timeout: 1000 * 60 * 5,
        authenticatorSelection: {
            residentKey: 'required',
            userVerification: 'preferred'
        }
    
    })
    const challenge = new PasskeyChallenge()
    challenge.id = options.challenge
    challenge.appUserId = userId
    challenge.webAuthnUserId = options.user.id
    challenge.type = 'registration'
    challenge.expiresAt = new Date(Date.now() + 1000 * 60 * 5)

    await challenge.save()

    return options
}

const verifyRegistration = async (userId: string, credential: RegistrationResponseJSON, challenge: string) => {
    const existingChallenge = await PasskeyChallenge.findOneOrFail({ where: { appUserId: userId, id: challenge, type: 'registration' } })

    if (existingChallenge.expiresAt < new Date()) {
        throw new Error('Challenge expired')
    }

    const { verified, registrationInfo } = await verifyRegistrationResponse({
        response: { ...credential, type: 'public-key' },
        expectedChallenge: challenge,
        expectedOrigin: process.env.WEBAUTHN_ORIGIN!!,
        requireUserVerification: true
    })

    if (!verified || !registrationInfo) {
        throw new Error('Verification failed')
    }

    const {
        aaguid,
        credentialPublicKey,
        credentialID,
        credentialDeviceType,
        credentialBackedUp,
        userVerified
      } = registrationInfo

      const base64PublicKey = base64url.encode(Buffer.from(credentialPublicKey))
      const { transports = [] } = credential.response
  
      const passkey = new Passkey()
      passkey.id = credentialID
      passkey.name = credentialID
      passkey.appUserId = userId
      passkey.webAuthnUserId = existingChallenge.webAuthnUserId!!
      passkey.publicKey = base64PublicKey
      passkey.deviceType = credentialDeviceType
      passkey.transports = transports
      passkey.aaguid = aaguid
      passkey.backedUp = credentialBackedUp
      passkey.userVerified = userVerified
      passkey.registeredAt = new Date()

      await passkey.save()
      await existingChallenge.remove()

      return { verified, passkey }
}

async function getAuthenticationOptions() {
    const options = await generateAuthenticationOptions({
        rpID: process.env.WEBAUTHN_RP_ID!!,
        timeout: 1000 * 60 * 5,
        userVerification: 'preferred',
        allowCredentials: []
    })

    const challenge = new PasskeyChallenge()
    challenge.id = options.challenge
    challenge.webAuthnUserId
    challenge.type = 'authentication'
    challenge.expiresAt = new Date(Date.now() + 1000 * 60 * 5)

    await challenge.save()

    return options
}

async function verifyAuthentication(
    authentication: AuthenticationResponseJSON,
    challenge: string
) {
    const challengeRecord = await PasskeyChallenge.findOneOrFail({
        where: { id: challenge }
    })

    const userCredential = await Passkey.findOneOrFail({
        where: { id: authentication.id }
    })

    const { verified, authenticationInfo } = await verifyAuthenticationResponse({
        response: authentication,
        expectedChallenge: challenge,
        expectedRPID: process.env.WEBAUTHN_RP_ID!!,
        expectedOrigin: process.env.WEBAUTHN_ORIGIN!!,
        requireUserVerification: true,
        authenticator: {
            credentialPublicKey: new Uint8Array(base64url.toBuffer(userCredential.publicKey)),
            credentialID: userCredential.id,
            counter: 0,
            transports: userCredential.transports as AuthenticatorTransport[]
        }
    })

    await PasskeyChallenge.remove(challengeRecord)
    const user = await User.findOneOrFail({ where: { id: userCredential.appUserId } })

    const token = createAccessToken(userCredential.appUserId)

    return { user, verified, token }
}

async function getUserCredentials(userId: string) {
    const credentials = await Passkey.find({ where: { appUserId: userId } })
    return credentials.map(({ id, name, registeredAt }) => ({
        id,
        name,
        registeredAt
    }))
}

export default {
    getAuthenticationOptions,
    getRegistrationOptions,
    getUserCredentials,
    verifyRegistration,
    verifyAuthentication
}