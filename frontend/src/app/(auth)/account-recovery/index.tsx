import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useLogout } from "../../../hooks/useLogout";

export default function AccountRecoveryScreen() {
    const logout = useLogout()
    const router = useRouter();
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="m-4">Account Recovery</Text>
            <Button mode="contained" className="m-4 w-2/3" onPress={() => router.replace('/(auth)/account-recovery/seedphrase')}>
                <Text>Recover with seedphrase</Text>
            </Button>
            <Button mode="outlined" className="m-4 w-2/3" onPress={logout}>
                <Text className="text-red-700">Log Out</Text>
            </Button>
        </View>
    )
}