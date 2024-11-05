import uballetAxios from "./fetcher";
import { Notification } from "./types";

async function getAllNotifications() {
    const { data } = await uballetAxios.get<Notification[]>("/notifications");
    return data
}

async function setNotificationsSeen({ lastNotificationId }: { lastNotificationId: string }) {
    await uballetAxios.post("/notifications/seen", { lastNotificationId });
    return;
}

export default {
    getAllNotifications,
    setNotificationsSeen
}