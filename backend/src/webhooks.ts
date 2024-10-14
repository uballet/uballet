import { Alchemy, Network, WebhookType,  } from "alchemy-sdk"
import { ALCHEMY_API_KEY, ALCHEMY_NOTIFY_AUTH_TOKEN } from "./env"
import { User } from "./entity/User";
import { WebHook } from "./entity/WebHook";
import { In } from "typeorm";

const alchemyClient = new Alchemy({
    apiKey: ALCHEMY_API_KEY,
    authToken: ALCHEMY_NOTIFY_AUTH_TOKEN,
    network: Network.ETH_SEPOLIA
})

export async function initWebHooks({ url }: { url: string }) {
    const webhooks = await alchemyClient.notify.getAllWebhooks();
    const users = await User.find();

    const addresses = users.map(user => user.walletAddress)

    const existingWebHook = webhooks.totalCount > 0 &&
        await WebHook.findOne({ where: { externalId: In(webhooks.webhooks.map(webhook => webhook.id)) } })

    if (!webhooks.webhooks.length || !existingWebHook) {
        if (!addresses.length) {
            return;
        }
        const webhook = await alchemyClient.notify.createWebhook(
            `${url}/address-activity`,
            WebhookType.ADDRESS_ACTIVITY,
            { addresses }
        )

        const newWebHook = new WebHook();
        newWebHook.externalId = webhook.id;
        newWebHook.name = "all-addresses-activity";
        newWebHook.type = webhook.type;
        newWebHook.network = Network.ETH_SEPOLIA;
        newWebHook.url = webhook.url;
        await newWebHook.save();
    } else {
        if (existingWebHook.url !== url) {
            existingWebHook.url = url;
            await alchemyClient.notify.deleteWebhook(existingWebHook.externalId);
            const newAlchemyWebhook = await alchemyClient.notify.createWebhook(
                `${url}/address-activity`,
                WebhookType.ADDRESS_ACTIVITY,
                { addresses }
            )
            existingWebHook.url = url;
            existingWebHook.externalId = newAlchemyWebhook.id;
            await existingWebHook.save();
        }
    }
}

export async function addAddressToWebhook({ address }: { address: string }) {
    const webHook = await WebHook.findOne({ where: { name: "all-addresses-activity" } })
    if (webHook) {
        try {
            await alchemyClient.notify.updateWebhook(webHook.externalId, { addAddresses: [address] })
        } catch(e) {
            console.error(e)
        }
    }
}