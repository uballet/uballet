import express, { Request, Response } from 'express';
import NotificationService from '../services/notification'
import { authenticateToken } from '../jwt-authentication';
import { Notification } from '../entity/Notification';

const router = express.Router();

interface NotificationResponse {
    id: string
    title: string
    body: string
    type: string
    seen: boolean
    createdAt: Date
    data: any
}

const formatNotification = (notification: Notification): NotificationResponse => {
    return {
        id: notification.id,
        title: notification.title,
        body: notification.body,
        type: notification.type,
        seen: notification.seen,
        createdAt: notification.createdAt,
        data: JSON.parse(notification.data)
    }
}

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    const user = res.locals.user
    const notifications = await NotificationService.getAllNotifications({ userId: user.id })
    return res.status(200).json(notifications.map(formatNotification))
})

router.post('/seen', authenticateToken, async (req: Request, res: Response) => {
    const user = res.locals.user
    const { lastNotificationId } = req.body
    await NotificationService.readNotifications({ userId: user.id, lastNotificationId })
    return res.status(200).send();
})
 

export default router