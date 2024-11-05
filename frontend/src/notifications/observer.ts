import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

/*
  This hook listens for notifications and redirects the user to the URL
  specified in the notification's data when a notification is received.

  To test naviagtion please go to https://expo.dev/notifications and send a 
  notifcation with data JSON lke:
    { "url" : "settings" } 
  or 
    { "url" : "transfer" } 
  where "settings" and "transfer" are the names of the screens in the app.
*/
export function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification received", response);
        redirect(response.notification);
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}
