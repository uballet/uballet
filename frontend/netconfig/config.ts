import { IS_E2E_TESTING } from "../src/env";
import networkConfig from "./blockchain.default.json";
import e2eTestingConfig from "./blockchain.e2e.json"

// @ts-ignore
const testConfig: typeof networkConfig = Object.keys(networkConfig).reduce((acc, key) => {
    // @ts-ignore
    acc[key] = e2eTestingConfig.sepolia
    return acc
}, {})

export default IS_E2E_TESTING ? testConfig : networkConfig