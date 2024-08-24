import { ActivityIndicator, Image, Text, View } from "react-native";
import styles from '../../../styles/styles';
import { useAccountContext } from "../../../hooks/useAccountContext";
import { Redirect } from "expo-router";
export default function InitializeAccountScreen() {
    const { initializing } = useAccountContext();

    if (!initializing) {
        return <Redirect href={'/(auth)/initialize-account/remember'} />
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image
                style={[styles.image]}
                source={require("../../../assets/logo.webp")}
            />
            <Text>Initializing Wallet</Text>
            <ActivityIndicator />
        </View>
    )
}