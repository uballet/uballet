import express, { Request, Response } from 'express';
import SignUpService from '../services/sign-up';
import SignInService from '../services/sign-in';
import { createAccessToken } from '../services/token';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
    const { email } = req.body
    const { user } = await SignUpService.signup(email)
    return res.status(200).json(user)
})

router.post('/verify-email', async (req: Request, res: Response) => {
  const { email, code } = req.body
  const user = await SignUpService.verifyUserEmail(email, code)

  const token = createAccessToken(user.id)
  return res.status(200).json({ ...user, token })
})

router.post('/email-sign-in', async (req: Request, res: Response) => {
  const { email, targetPublicKey } = req.body
  const user = await SignInService.signInWithEmailSimpler({ email })
  return res.status(200).send();
})

router.post('/complete-sign-in', async (req: Request, res: Response) => {
  const { email, code } = req.body
  const { user, token } = await SignInService.completeSimplerEmailSignIn({ email, code })
  res.status(200).send({ ...user, token })
})


export default router