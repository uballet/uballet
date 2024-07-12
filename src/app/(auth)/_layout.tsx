import { useEffect } from "react";
import { Redirect, router, Slot, usePathname } from "expo-router";
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

    useEffect(() => {
        if (isSuccess && !passkeys?.length && !isRegisterPasskeys && !passkeysOnboarded) {
            router.navigate('/(auth)/register-passkey')
        }
    }, [isSuccess, router, isRegisterPasskeys, passkeys])

    if (!user?.verified) {
        return <Redirect href={'/(public)'} />
    }

    if (!account || isLoading) {
        return <ActivityIndicator />
    }

    return (
        <Slot />
    )
}