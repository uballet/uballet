import express from "express";
import ContactsService from "../services/contacts";

const router = express.Router();

router.get("/", async (req, res) => {
  const user = res.locals.user;

  const contacts = await ContactsService.getContacts(user.id);

  return res.status(200).json(contacts);
});

router.post("/", async (req, res) => {
  const user = res.locals.user;
  const { name, address } = req.body;
  const contact = await ContactsService.addContact(user.id, { name, address });
  return res.status(200).json(contact);
});

router.delete("/:id", async (req, res) => {
  const user = res.locals.user;
  const { id } = req.params;
  await ContactsService.deleteContact(user.id, id);
  return res.status(200).json({ message: "Contact deleted" });
});

export default router;
