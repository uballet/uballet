import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useAuthContext } from "../../providers/AuthProvider";
import { useUserPasskeys } from "../../hooks/useUserPasskeys";
import { useAccountContext } from "../../hooks/useAccountContext";
import { Passkey } from "react-native-passkey";

export default function AuthIndex() {
    const { passkeysOnboarded, user } = useAuthContext()
    const { needsRecovery, lightAccount, initiator }  = useAccountContext()
    const account = lightAccount || initiator
    const { isSuccess, isLoading: loadingPasskeys, passkeys } = useUserPasskeys()

    if (needsRecovery) {
        return <Redirect href={'/(auth)/account-recovery'} />
    }

    if (!user?.walletAddress) {
        return <Redirect href={'/(auth)/initialize-account'} />
    }

    if (account && isSuccess && !passkeys?.length && !passkeysOnboarded && Passkey.isSupported()) {
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