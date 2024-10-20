import { useQuery } from "@tanstack/react-query";
import uballet from "../../api/uballet";
import { Notification } from "../../api/uballet/types";

export function useAllNotifications() {
    const query = useQuery({
        queryKey: ['notifications'],
        refetchInterval: 5000,
        queryFn: async () => {
            const notifs = await uballet.notifications.getAllNotifications()
            return notifs.map(n => ({...n, createdAt: new Date(n.createdAt) }))
        }
    })

    return query
}