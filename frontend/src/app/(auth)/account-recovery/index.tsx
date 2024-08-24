import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { useLogout } from "../../../hooks/useLogout";

export default function AccountRecoveryScreen() {
    const logout = useLogout()
    const router = useRouter();
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Account Recovery</Text>
            <Button onPress={() => router.replace('/(auth)/account-recovery/seedphrase')}>
                <Text>Recover with seedphrase</Text>
            </Button>
            <Button onPress={logout}>
                <Text style={{ color: "red" }}>Log Out</Text>
            </Button>
        </View>
    )
}