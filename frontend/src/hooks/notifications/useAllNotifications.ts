import { useQuery } from "@tanstack/react-query";
import uballet from "../../api/uballet";
import { Notification } from "../../api/uballet/types";

const testNotifications = [
     { title: "Test Notification Title", body: "This is the body of the test notification!!!!!", createdAt: new Date() },
     { title: "test 2", body: "test 2", createdAt: new Date() },
     { title: "Seen Notification", body: "This is a past notification, you've already seen it before pal. Better luck next time", createdAt: new Date('2024-01-01'), seen: true }
]


export function useAllNotifications() {
    const query = useQuery({
        queryKey: ['notifications'],
        refetchInterval: 20000,
        queryFn: async () => {
            const notifs = await uballet.notifications.getAllNotifications()
            return [...notifs.map(n => ({...n, createdAt: new Date(n.createdAt) })), ...testNotifications] as Notification[]
        }
    })

    return query
}