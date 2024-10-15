import { configDotenv } from "dotenv";

configDotenv();

// environment
export const BUILD_ENV = process.env.BUILD_ENV || "development";

// postgres
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || "5432";
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
export const DB_NAME = process.env.DB_NAME || "uballet";

// jwt encryption
export const JWT_SECRET = process.env.JWT_SECRET;

// email service
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

// encryption
export const AES_SECRET_HEX = process.env.AES_SECRET_HEX;
export const AES_IV_HEX = process.env.AES_IV_HEX;

// server port
export const PORT = process.env.PORT || 3000;

// Android signing
export const ANDROID_SHA_HEX_VALUE = process.env.ANDROID_SHA_HEX_VALUE;

// WebAuthn
export const WEBAUTHN_RP_ID = process.env.WEBAUTHN_RP_ID;
export const WEBAUTHN_RP_NAME = process.env.WEBAUTHN_RP_NAME;
export const WEBAUTHN_ORIGIN = process.env.WEBAUTHN_ORIGIN;

export const CMC_API_KEY = process.env.CMC_API_KEY as string;
export const EXPO_ACCESS_TOKEN= process.env.EXPO_ACCESS_TOKEN as string
export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY as string
export const ALCHEMY_NOTIFY_AUTH_TOKEN = process.env.ALCHEMY_NOTIFY_AUTH_TOKEN as string
export const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN as string
export const NGROK_DOMAIN = process.env.NGROK_DOMAIN as string
export const IS_E2E_TESTING = process.env.IS_E2E_TESTING === "1"
export const TEST_DB_PORT = process.env.TEST_DB_PORT as string