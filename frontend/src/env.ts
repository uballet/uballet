// uballet api
export const UBALLET_API_URL = "http://192.168.0.8:3000"

// alchemy api
export const ALCHEMY_API_URL = process.env.EXPO_PUBLIC_ALCHEMY_API_URL
export const ALCHEMY_POLICY_ID = process.env.EXPO_PUBLIC_ALCHEMY_POLICY_ID

// storybook
export const IS_STORYBOOK = process.env.EXPO_PUBLIC_STORYBOOK === 'true'