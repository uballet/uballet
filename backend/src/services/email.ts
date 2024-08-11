import sendgrid from '@sendgrid/mail'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!!)

async function sendEmail(to: string, subject: string, text: string) {
    return sendgrid.send({
        to,
        from: process.env.SENDGRID_FROM_EMAIL!!,
        subject,
        text,
        html: `<p>${text}</p>`, // html body text
    })
}

export default {
    sendEmail
}