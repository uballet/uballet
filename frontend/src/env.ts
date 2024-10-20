// uballet api
export const UBALLET_API_URL = process.env.EXPO_PUBLIC_UBALLET_API_URL;

// alchemy api
export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// alchemy api
export const ALCHEMY_API_URL = process.env.EXPO_PUBLIC_ALCHEMY_API_URL;
export const ALCHEMY_POLICY_ID = process.env.ALCHEMY_POLICY_ID;


// gas policies
export const SEPOLIA_ALCHEMY_POLICY_ID = process.env.SEPOLIA_ALCHEMY_POLICY_ID
export const OPT_SEPOLIA_ALCHEMY_POLICY_ID = process.env.OPT_SEPOLIA_ALCHEMY_POLICY_ID
export const ARB_SEPOLIA_ALCHEMY_POLICY_ID = process.env.ARB_SEPOLIA_ALCHEMY_POLICY_ID
export const BASE_SEPOLIA_ALCHEMY_POLICY_ID = process.env.BASE_SEPOLIA_ALCHEMY_POLICY_ID

// storybook
export const IS_STORYBOOK = process.env.EXPO_PUBLIC_STORYBOOK === "true";

// e2e
export const IS_E2E_TESTING = process.env.IS_E2E_TESTING === "1";
