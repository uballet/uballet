import { PropsWithChildren, useEffect } from "react";
import { useAuthContext } from "./AuthProvider";
import { registerForPushNotificationsAsync } from "../notifications/register";
import uballet from "../api/uballet";

export function PushNotificationProvider({ children }: PropsWithChildren) {
    const { user } = useAuthContext();

    useEffect(() => {
        if (user) {
            registerForPushNotificationsAsync().then((token) => {
                if (!token) {
                    return
                }
                uballet.registerDeviceToken({ token })
            })
        }
    }, [user])

    return children
}