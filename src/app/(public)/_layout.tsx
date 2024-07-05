import { Redirect, router, Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect } from "react";

export default function PublicLayout() {
    const { user } = useAuthContext()

    if (user?.verified) {
        return <Redirect href={'/(auth)'} />
    }

    useEffect(() => {
        if (user && !user.verified) {
            router.navigate('/(public)/verify-email')
        }
    }, [user, user?.verified])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Slot />
        </SafeAreaView>
    )
}