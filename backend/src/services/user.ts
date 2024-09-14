import { User } from "../entity/User"
import { UserDevice } from "../entity/UserDevice"
import { Address } from "../types"

async function getUserById(id: string) {
    const user = await User.findOneOrFail({ where: { id } })
    return user
}

async function setWalletAddress(id: string, address: Address) {
    const user = await User.findOneOrFail({ where: { id } })
    user.walletAddress = address
    await user.save()
    return user
}

async function setDeviceToken(user: User, token: string) {
    const existing = await UserDevice.findOne({ where: { userId: user.id, token: token } })

    if (!existing) {
        const device = new UserDevice()
        device.token = token
        device.userId = user.id
        return await device.save()
    }

    return existing
}

export default {
    getUserById,
    setWalletAddress,
    setDeviceToken
}