import { ActivityIndicator, Image, Text, View } from "react-native";
import styles from '../../../styles/styles';
import { useAccountContext } from "../../../hooks/useAccountContext";
import { Redirect } from "expo-router";
export default function InitializeAccountScreen() {
    const { initializing, accountType } = useAccountContext();

    if (!accountType) {
        return <Redirect href={'/(auth)/initialize-account/type-selection'} />
    }

    if (!initializing) {
        return <Redirect href={'/(auth)/initialize-account/remember'} />
    }

    return (
        <View className="flex-1 items-center justify-center">
            <Image
                style={[styles.image]}
                source={require("../../../assets/logo.webp")}
            />
            <Text>Initializing Wallet</Text>
            <ActivityIndicator />
        </View>
    )
}