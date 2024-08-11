import { User } from "../entity/User"

async function getUserById(id: string) {
    const user = await User.findOneOrFail({ where: { id } })
    return user
}

export default {
    getUserById
}