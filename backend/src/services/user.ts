import { User } from "../entity/User"

async function getUserById(id: string) {
    const user = await User.findOneOrFail({ where: { id } })
    return user
}

async function setWalletAddress(id: string, address: string) {
    const user = await User.findOneOrFail({ where: { id } })
    user.walletAddress = address
    await user.save()
    return user
}

export default {
    getUserById,
    setWalletAddress
}