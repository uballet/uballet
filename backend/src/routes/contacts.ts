import express from 'express'
import { authenticateToken } from '../jwt-authentication';
import ContactsService from '../services/contacts'

const router = express.Router();

router.get('/', async (req, res) => {
    const user = res.locals.user

    const contacts = await ContactsService.getContacts(user.id)

    return res.status(200).json(contacts)
})

router.post('/', async (req, res) => {
    const user = res.locals.user
    const { name, address } = req.body
    const contact = await ContactsService.addContact(user.id, { name, address })
    return res.status(200).json(contact)
})

export default router