import express, { Request, Response } from 'express';
import PasskeyService from '../services/passkey';
import { authenticateToken } from '../jwt-authentication';

const router = express.Router();

router.get('/passkey-registration-options', authenticateToken, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.user
    const options = await PasskeyService.getRegistrationOptions(user.id)
    return res.status(200).json(options)
})

router.get('/passkey-authentication-options', async (req: Request, res: Response) => {
    const options = await PasskeyService.getAuthenticationOptions()
    return res.status(200).json(options)
})

router.get('/passkeys', authenticateToken, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.user
    const credentials = await PasskeyService.getUserCredentials(user.id as string)
    return res.status(200).json(credentials)
})

router.post('/verify-passkey-authentication', async (req: Request, res: Response) => {
  const { credentials, challenge } = req.body

  const { user, verified, token } = await PasskeyService.verifyAuthentication(credentials, challenge)

  if (!verified) {
    return res.status(401).send()
  }

  return res.status(200).json({ ...user, token })
})

router.post('/verify-passkey-registration', authenticateToken, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.user
    const { credentials, challenge } = req.body
    const { verified, passkey } = await PasskeyService.verifyRegistration(user.id, credentials, challenge)

    if (!verified) {
        return res.status(401).send()
    }
    return res.status(200).json(passkey)
})

export default router