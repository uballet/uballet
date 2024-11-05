import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './env'
import { User } from './entity/User'

// @ts-ignore
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, JWT_SECRET as string, async (err: any, payload: any) => {
      if (err) return res.sendStatus(403)
  
      const user = await User.findOneOrFail({ where: { id: payload.id } })
      req.user = user
      res.locals.user = user
  
      next()
    })
}