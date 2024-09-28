import { SafeAreaView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAccountContext } from "../../../hooks/useAccountContext";
import { Redirect } from "expo-router";

export default function AccountTypeSelectionScreen() {
    const { setAccountType, initializing } = useAccountContext();

    if (initializing) {
        return <Redirect href={'/(auth)/initialize-account/'} />
    }
    return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <Text className="text-lg font-semibold mb-4">Select your account type</Text>
            <View>
                <Button className="mb-4" mode="contained" onPress={() => setAccountType("light")}>
                    Light Account
                </Button>
            </View>
            <View>
                <Button className="mb-4" mode="contained" onPress={() => setAccountType("multisig")}>
                    Pro Account
                </Button>
            </View>
        </SafeAreaView>
    )
}