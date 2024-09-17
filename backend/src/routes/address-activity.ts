import express, { Request, Response } from 'express';
import { User } from '../entity/User';
import pushNotification from '../services/push-notification';

const router = express.Router();

router.get('/address-activity', async (req: Request, res: Response) => {

    return res.status(200).json({ test: 'HELLO' })
})

router.post('/address-activity', async (req: Request, res: Response) => {
    const { data } = req.body
    console.log({ data, body: req.body })
    const { event } = req.body;

    if (!event) {
        return res.status(200);
    }
    const { activity } = event;
    activity.forEach(async (a: any) => {
        const { fromAddress, toAddress, amount, asset } = a;
        const fromUser = await User.findOneBy({ walletAddress: fromAddress });
        const toUser = await User.findOneBy({ walletAddress: toAddress });
        console.log({ a })
        if (fromUser) {
            await pushNotification.sendNotificationToUser({
                userId: fromUser?.id,
                title: 'Transfer',
                body: `Transfered ${asset} ${amount} to ${toAddress}${toUser ? `(${toUser?.email})` : ''}`,
                data: { type: 'transfer-sent'}
            })
        }
        if (toUser) {
            await pushNotification.sendNotificationToUser({
                userId: toUser?.id,
                title: 'Transfer',
                body: `Received ${asset} ${amount} from ${fromAddress} ${fromUser ? `(${fromUser?.email})` : ''}`,
                data: { type: 'transfer-received'}
            })
        }
    })
    return res.status(200).send()
});

export default router