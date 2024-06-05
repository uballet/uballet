import { useAccountContext } from "./useAccountContext";

export function useLightAccount() {
    const { account } = useAccountContext()

    return account
}

export function useSafeLightAccount() {
    const { account } = useAccountContext()

    if (!account) {
        throw new Error('Account not ready');
    }

    return account
}