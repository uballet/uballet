import { Alchemy, Network, WebhookType,  } from "alchemy-sdk"
import { ALCHEMY_API_KEY, ALCHEMY_NOTIFY_AUTH_TOKEN } from "./env"
import { User } from "./entity/User";
import { WebHook } from "./entity/WebHook";
import { In } from "typeorm";


const networks = [
    Network.ETH_SEPOLIA,
    Network.ARB_SEPOLIA,
    Network.BASE_SEPOLIA,
    Network.OPT_SEPOLIA,
    Network.ETH_MAINNET,
    Network.ARB_MAINNET,
    Network.BASE_MAINNET,
    Network.OPT_MAINNET
]

export async function initWebHooks({ url }: { url: string }) {
    for (const network of networks) {
        try {
            const alchemyClient = new Alchemy({
                apiKey: ALCHEMY_API_KEY,
                authToken: ALCHEMY_NOTIFY_AUTH_TOKEN,
                network
            })
            const webhooks = await alchemyClient.notify.getAllWebhooks();
            const users = await User.find();

            const addresses = users.map(user => user.walletAddress)

            const existingWebHook = webhooks.totalCount > 0 &&
                await WebHook.findOne({ where: { externalId: In(webhooks.webhooks.map(webhook => webhook.id)), network: network } })

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
                newWebHook.network = network;
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
        } catch (e) {
            console.error("ERROR WHILE CREATING WEBHOOK");
            console.error(e);
        }
    }
}

export async function addAddressToWebhook({ address }: { address: string }) {
    const webHooks = await WebHook.find({ where: { name: "all-addresses-activity" } })
    webHooks.forEach(async (webHook) => {
        const alchemyClient = new Alchemy({
            apiKey: ALCHEMY_API_KEY,
            authToken: ALCHEMY_NOTIFY_AUTH_TOKEN,
            network: webHook.network as Network
        })
        try {
            await alchemyClient.notify.updateWebhook(webHook.externalId, { addAddresses: [address] })
        } catch(e) {
            console.error(e)
        }
    })
}