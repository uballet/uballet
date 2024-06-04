import { useEffect } from "react";
import { useIsLoggedIn } from "../../hooks/useIsLoggedIn";
import { Redirect, Slot } from "expo-router";
import { SafeAreaView } from "react-native";

export default function AuthenticatedLayout() {
    const isLoggedIn = useIsLoggedIn()

    if (!isLoggedIn) {
        return <Redirect href={'/(public)'} />
    }

    return (
        <Slot />
    )
}