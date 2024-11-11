import express, { Request, Response } from 'express';
import { User } from '../entity/User';
import pushNotification from '../services/push-notification';
import NotificationService from "../services/notification"
const router = express.Router();

const ENTRYPOINT_06 = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const ENTRYPOINT_07 = "0x0000000071727De22E5E9d8BAf0edAc6f37da032"

router.post('/address-activity', async (req: Request, res: Response) => {
    const { data } = req.body
    console.log({ data, body: req.body })
    const { event } = req.body;

    if (!event) {
        return res.status(200);
    }
    const { activity } = event;
    activity.forEach(async (a: any) => {
        const { fromAddress, toAddress, amount: activityAmount, value, asset, type, category } = a;
        if (toAddress.toLowerCase() === ENTRYPOINT_06.toLowerCase() || toAddress.toLowerCase() === ENTRYPOINT_07.toLowerCase()) {
            return;
        }
        console.log({ fromAddress, toAddress, amount: activityAmount, value, asset, type, category })
        console.log({ a })
        const amount = activityAmount ?? value
        if (!(amount > 0)) {
            return;
        }
        const fromUser = await User.findOneBy({ walletAddress: fromAddress.toLowerCase() });
        const toUser = await User.findOneBy({ walletAddress: toAddress.toLowerCase() });
        if (fromUser) {
            await NotificationService.createNotification({
                userId: fromUser?.id,
                title: 'Transfer',
                type: 'transfer-sent',
                body: `Transfered ${asset} ${amount} to ${toAddress}${toUser ? `(${toUser?.email})` : ''}`,
                data: { type: 'transfer-sent'},
                sendPush: true
            })
        }
        if (toUser) {
            await NotificationService.createNotification({
                userId: toUser?.id,
                title: 'Transfer',
                type: 'transfer-received',
                body: `Received ${asset} ${amount} from ${fromAddress} ${fromUser ? `(${fromUser?.email})` : ''}`,
                data: { type: 'transfer-received'},
                sendPush: true
            })
        }
    })
    return res.status(200).send()
});

export default router