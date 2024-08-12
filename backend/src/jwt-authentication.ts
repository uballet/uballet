import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './env'

// @ts-ignore
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, JWT_SECRET as string, (err: any, payload: any) => {
      if (err) return res.sendStatus(403)
  
      req.user = payload
      res.locals.user = payload
  
      next()
    })
}