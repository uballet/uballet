import { Redirect, Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsLoggedIn } from "../../hooks/useIsLoggedIn";

export default function PublicLayout() {
    const isLoggedIn = useIsLoggedIn()

    console.log('isLoggedIn', isLoggedIn)
    if (isLoggedIn) {
        return <Redirect href="/(auth)" />
    }

    return (
        <SafeAreaView>
            <Slot />
        </SafeAreaView>
    )
}