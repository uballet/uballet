import { EmailVerificationCode } from "../entity/EmailVerificationCode"
import { User } from "../entity/User"
import { BUILD_ENV, IS_E2E_TESTING } from "../env"
import EmailService from "./email"


async function sendUserVerificationEmail(user: User, code: string) {
    if (BUILD_ENV === 'development') {
        console.log(`Verification code for: ${user.email}: ${code}`)
    }

    return EmailService.sendEmail(user.email, 'UBALLET - Verify your email', `Your verification code is: ${code}`)
}

export async function createEmailVerificationCode(userId: string, type: string): Promise<EmailVerificationCode> {
    const verificationCode = new EmailVerificationCode()

    const code = Math.floor(Math.random() * 1000000).toString()
    verificationCode.code = code.length < 6 ? '0' + code : code
    verificationCode.expiresAt = new Date(Date.now() + 1000 * 60 * 30)
    verificationCode.userId = userId
    verificationCode.type = type

    await verificationCode.save()

    return verificationCode
}


async function signup(email: string): Promise<{ user: User }> {
    const existing = await User.findOne({ where: { email } })

    if (existing?.verified) {
        throw new Error('User already exists')
    }

    if (existing && !existing.verified) {
        const code = await createEmailVerificationCode(existing.id, 'signup')
        await sendUserVerificationEmail(existing, code.code)
        return { user: existing }
    }

    const user = new User()
    user.email = email
    user.verified = false

    await user.save()

    const verificationCode = await createEmailVerificationCode(user.id, 'signup')
    await sendUserVerificationEmail(user, verificationCode.code)

    return { user }
}


const verifyUserEmail = async (email: string, code: string) => {
    const user = await User.findOneOrFail({ where: { email } })

    if (IS_E2E_TESTING) {
        user.verified = true
        await user.save()
        return user
    }
    const verificationCode = await EmailVerificationCode.findOneOrFail({ where: { userId: user.id, code, type: 'signup' } })

    if (verificationCode.expiresAt < new Date()) {
        throw new Error('Verification code expired')
    }

    user.verified = true
    await user.save()
    return user
}

export default {
    signup,
    verifyUserEmail
}