import { UserDevice } from "../entity/UserDevice";
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  /*
   * @deprecated
   * The optional useFcmV1 parameter defaults to true, as FCMv1 is now the default for the Expo push service.
   *
   * If using FCMv1, the useFcmV1 parameter may be omitted.
   * Set this to false to have Expo send to the legacy endpoint.
   *
   * See https://firebase.google.com/support/faq#deprecated-api-shutdown
   * for important information on the legacy endpoint shutdown.
   *
   * Once the legacy service is fully shut down, the parameter will be removed in a future PR.
   */
  useFcmV1: true,
});

interface SendPushNotificationArgs {
    userId: string;
    body: string;
    title: string;
    data?: object;
}

async function sendNotificationToUser({ userId, title, body }: SendPushNotificationArgs) {
    const devices = await UserDevice.find({ where: { userId } })

    const tokens = devices.map(device => device.token)
    if (!tokens.length) {
        return
    }
    const message: ExpoPushMessage = {
        to: tokens,
        sound: 'default',
        title: title,
        body: body,
        data: { testData: 'goes here' },
    }
    try {
        const tickets = await expo.sendPushNotificationsAsync([message])
        console.log({ tickets })
        return tickets
    } catch(e) {
        console.error(e)
    }
}

export default {
    sendNotificationToUser
}

