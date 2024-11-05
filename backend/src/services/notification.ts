import { Notification } from "../entity/Notification";
import pushNotification from "./push-notification";

interface CreateNotificationArgs {
    userId: string;
    title: string;
    body: string;
    type: string;
    data?: object;
    sendPush: boolean;
}

async function createNotification({
    userId,
    title,
    body,
    type,
    data,
    sendPush
}: CreateNotificationArgs) {
    const newNotification = new Notification();
    newNotification.title = title
    newNotification.body = body
    newNotification.type = type
    newNotification.data = JSON.stringify(data ?? {})
    newNotification.userId = userId
    newNotification.seen = false
    newNotification.createdAt = new Date()

    await newNotification.save();

    if (sendPush) {
        pushNotification.sendNotificationToUser({ userId, title, body, data: { type, ...(data || {}) } })
    }

    return newNotification
}

async function getAllNotifications({ userId }: { userId: string }) {
    const notifications = await Notification.find({ where: { userId }, order: { createdAt: 'DESC' } })
    return notifications
}

async function readNotifications({ userId, lastNotificationId }: { userId: string, lastNotificationId: string }) {
    const notifications = await Notification.find({ where: { userId, seen: false }, order: { createdAt: 'DESC' } })
    const indexOfLastNotification = notifications.findIndex(n => n.id === lastNotificationId)

    if (indexOfLastNotification === -1) {
        return
    }

    const notificationsToUpdate = notifications.slice(indexOfLastNotification)
    notificationsToUpdate.forEach((notification) => {
            notification.seen = true
    })

    await Notification.save(notificationsToUpdate)
    return;
}

export default {
    createNotification,
    getAllNotifications,
    readNotifications
}