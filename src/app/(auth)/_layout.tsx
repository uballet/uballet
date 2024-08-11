import { Redirect, Slot, usePathname } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useLightAccount } from "../../hooks/useLightAccount";
import { useAuthContext } from "../../providers/AuthProvider";
import { useUserPasskeys } from "../../hooks/useUserPasskeys";

export default function AuthenticatedLayout() {
    const { user, passkeysOnboarded } = useAuthContext()
    const account = useLightAccount()
    const { isSuccess, isLoading, passkeys } = useUserPasskeys()
    const pathname = usePathname()
    const isRegisterPasskeys = pathname.includes('/register-passkey')

    if (!user?.verified) {
        return <Redirect href={'/(public)'} />
    }

    const shouldRedirect = isSuccess && !passkeys?.length && !isRegisterPasskeys && !passkeysOnboarded

    if (shouldRedirect) {
        return <Redirect href={'/(auth)/register-passkey'} />
    }

    if (!account || isLoading) {
        return <ActivityIndicator />
    }

    return (
        <Slot />
    )
}