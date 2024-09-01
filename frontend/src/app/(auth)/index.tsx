import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useAuthContext } from "../../providers/AuthProvider";
import { useUserPasskeys } from "../../hooks/useUserPasskeys";
import { useAccountContext } from "../../hooks/useAccountContext";

export default function AuthIndex() {
    const { passkeysOnboarded } = useAuthContext()
    const { needsRecovery, initializing, account }  = useAccountContext()
    const { isSuccess, isLoading: loadingPasskeys, passkeys } = useUserPasskeys()

    if (needsRecovery) {
        return <Redirect href={'/(auth)/account-recovery'} />
    }

    if (initializing) {
        return <Redirect href={'/(auth)/initialize-account'} />
    }

    if (account && isSuccess && !passkeys?.length && !passkeysOnboarded) {
        return <Redirect href={'/(auth)/register-passkey'} />
    }

    if (loadingPasskeys) {
        return <ActivityIndicator />
    }

    if (!account) {
        return <ActivityIndicator />
    }

    return <Redirect href={'/(auth)/(tabs)'} />

}