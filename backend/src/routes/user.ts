import express, { Request, Response } from 'express';
import UserService from '../services/user'
import { authenticateToken } from '../jwt-authentication';

const router = express.Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    // @ts-ignore
    const reqUser = req.user
    const user = await UserService.getUserById(reqUser.id)
    const userObj = {
        ...user,
        hasWallet: !!user.walletAddress
    }
    return res.status(200).json(userObj)
})
  
router.post('/wallet-address', authenticateToken, async (req: Request, res: Response) => {
    // @ts-ignore
    const reqUser = req.user
    const { walletAddress } = req.body
    const user = await UserService.setWalletAddress(reqUser.id, walletAddress)

    const userObj = {
        ...user,
        hasWallet: !!user.walletAddress
    }
    
    return res.status(200).json(userObj)
})

export default router