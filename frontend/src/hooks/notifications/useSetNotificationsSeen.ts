import { useMutation } from "@tanstack/react-query";
import uballet from "../../api/uballet";

export function useSetNotificationsSeen() {
    const mutation = useMutation({
        mutationFn: ({ lastNotificationId }: { lastNotificationId: string }) => uballet.notifications.setNotificationsSeen({ lastNotificationId })
    })
    return mutation
}