import { configDotenv } from "dotenv"

configDotenv();

// environment
export const BUILD_ENV = process.env.BUILD_ENV || 'development'

// postgres
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_PORT = process.env.DB_PORT || '5432'
export const DB_USER = process.env.DB_USER || 'postgres'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres'
export const DB_NAME = process.env.DB_NAME || 'uballet'

// jwt encryption
export const JWT_SECRET = process.env.JWT_SECRET

// email service
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
export const SENDGRID_FROM_EMAIL= process.env.SENDGRID_FROM_EMAIL

// encryption
export const AES_SECRET_HEX = process.env.AES_SECRET_HEX
export const AES_IV_HEX = process.env.AES_IV_HEX

// server port
export const PORT = process.env.PORT || 3000

// Android signing
export const ANDROID_SHA_HEX_VALUE = process.env.ANDROID_SHA_HEX_VALUE

// WebAuthn
export const WEBAUTHN_RP_ID = process.env.WEBAUTHN_RP_ID
export const WEBAUTHN_RP_NAME = process.env.WEBAUTHN_RP_NAME
export const WEBAUTHN_ORIGIN = process.env.WEBAUTHN_ORIGIN