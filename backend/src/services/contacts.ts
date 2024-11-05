import { ContactAddress } from "../entity/ContactAddress";

interface ContactInput {
  name: string;
  address: string;
}
async function addContact(userId: string, { name, address }: ContactInput) {
  const newAddress = new ContactAddress();

  newAddress.name = name;
  newAddress.address = address;
  newAddress.ownerId = userId;

  await newAddress.save();
  return newAddress;
}

async function getContacts(userId: string) {
  const addresses = await ContactAddress.find({ where: { ownerId: userId } });

  return addresses;
}

async function deleteContact(userId: string, addressId: string) {
  console.log("Deleting contact:", addressId, "from user:", userId);

  const address = await ContactAddress.findOne({
    where: { id: addressId, ownerId: userId },
  });

  if (!address) {
    console.log("Contact not found, maybe it was already deleted");
    return;
  }

  await address.remove();
}

export default {
  getContacts,
  addContact,
  deleteContact,
};
