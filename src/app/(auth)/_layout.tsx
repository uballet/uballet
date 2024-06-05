import { useEffect } from "react";
import { useIsLoggedIn } from "../../hooks/useIsLoggedIn";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { useLightAccount } from "../../hooks/useLightAccount";

export default function AuthenticatedLayout() {
    const isLoggedIn = useIsLoggedIn()
    const account = useLightAccount()

    if (!isLoggedIn) {
        return <Redirect href={'/(public)'} />
    }

    if (!account) {
        return <ActivityIndicator />
    }

    return (
        <Slot />
    )
}