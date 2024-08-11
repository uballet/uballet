import { ContactAddress } from "../entity/ContactAddress"

interface ContactInput {
    name: string
    address: string
}
async function addContact(userId: string, { name, address }: ContactInput) {
    const newAddress = new ContactAddress()

    newAddress.name = name
    newAddress.address = address
    newAddress.ownerId = userId
    
    await newAddress.save();
    return newAddress;
}

async function getContacts(userId: string) {
    const addresses = await ContactAddress.find({ where: { ownerId: userId } })

    return addresses
}

export default {
    getContacts,
    addContact
}