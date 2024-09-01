import { Redirect } from "expo-router";
import { useAuthContext } from "../../providers/AuthProvider";
import { Image, View } from "react-native";
import styles from "../../styles/styles";

export default function LockedScreen() {
    const { requiresLocalAuthentication } = useAuthContext()

    if (!requiresLocalAuthentication) {
        return <Redirect href={'/(auth)/(tabs)'} />
    }

    return (
        <View className="flex-1 items-center justify-center">
            <Image
                style={[styles.image]}
                source={require("../../assets/logo.webp")}
            />
        </View>
    )
}