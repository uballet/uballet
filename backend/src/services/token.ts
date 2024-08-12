
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../env'

export function createAccessToken(userId: string) {
    const payload = { id: userId }

    return jwt.sign(payload, JWT_SECRET!!, {
        expiresIn: '1d'
    })
}