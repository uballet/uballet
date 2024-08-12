import sendgrid from '@sendgrid/mail'
import { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } from '../env'

sendgrid.setApiKey(SENDGRID_API_KEY!!)

async function sendEmail(to: string, subject: string, text: string) {
    return sendgrid.send({
        to,
        from: SENDGRID_FROM_EMAIL!!,
        subject,
        text,
        html: `<p>${text}</p>`, // html body text
    })
}

export default {
    sendEmail
}