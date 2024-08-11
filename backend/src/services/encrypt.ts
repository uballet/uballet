import crypto from 'crypto'

const SECRET = Buffer.from(process.env.AES_SECRET_HEX as string, 'hex');
const IV = Buffer.from(process.env.AES_IV_HEX as string, 'hex');
const ALGORITHM = 'aes-128-cbc';

export function encryptValue(text: string) {
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decryptValue(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET, IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export default {
    encryptValue,
    decryptValue
}