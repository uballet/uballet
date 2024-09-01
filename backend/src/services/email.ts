import sendgrid from '@sendgrid/mail'
import { BUILD_ENV, SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } from '../env'

sendgrid.setApiKey(SENDGRID_API_KEY!!)

async function sendEmail(to: string, subject: string, text: string) {
    if (BUILD_ENV === 'testing') {
        try {
            return sendgrid.send({
                to,
                from: SENDGRID_FROM_EMAIL!!,
                subject,
                text,
                html: `<p>${text}</p>`, // html body text
            })
        } catch (error) {
            console.error(error)
        }
    }

    if (BUILD_ENV === 'development') {
        console.log({ to, subject, text })
    }
}

export default {
    sendEmail
}