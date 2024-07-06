import { useEffect } from "react";
import { Redirect, router, Slot, usePathname } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useLightAccount } from "../../hooks/useLightAccount";
import { useAuthContext } from "../../providers/AuthProvider";
import { useWebAuthnCredentials } from "../../hooks/useWebAuthnCredentials";

export default function AuthenticatedLayout() {
    const { user } = useAuthContext()
    const account = useLightAccount()
    const { passkeysOnboarded, isSuccess } = useWebAuthnCredentials()

    const pathname = usePathname()
    const isRegisterPasskeys = pathname.includes('/register-passkey')

    useEffect(() => {
        if (isSuccess && !passkeysOnboarded && !isRegisterPasskeys) {
            router.navigate('/(auth)/register-passkey')
        }
    }, [isSuccess, passkeysOnboarded, router, isRegisterPasskeys])

    if (!user?.verified) {
        return <Redirect href={'/(public)'} />
    }

    if (!account) {
        return <ActivityIndicator />
    }

    return (
        <Slot />
    )
}