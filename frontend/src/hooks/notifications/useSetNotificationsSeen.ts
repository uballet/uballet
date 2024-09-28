import { useMutation, useQueryClient } from "@tanstack/react-query";
import uballet from "../../api/uballet";

export function useSetNotificationsSeen() {
    const client = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ lastNotificationId }: { lastNotificationId: string }) => uballet.notifications.setNotificationsSeen({ lastNotificationId }),
        onSuccess: () => {
            client.refetchQueries({ queryKey: ['notifications'] })
        }
    })
    return mutation
}