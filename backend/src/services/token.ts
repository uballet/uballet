
import jwt from 'jsonwebtoken'

export function createAccessToken(userId: string) {
    const payload = { id: userId }

    return jwt.sign(payload, process.env.JWT_SECRET!!, {
        expiresIn: '1d'
    })
}