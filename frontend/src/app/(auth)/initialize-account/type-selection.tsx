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
            <View className="border rounded-md border-blue-400 p-8 pb-0 mb-2 w-3/4">
                <Text className="text-sm font-bold mb-2">Recommended</Text>
                <Text className="text-sm font-semibold mb-2"> - Lower Gas Fees</Text>
                <Text className="text-sm font-semibold mb-2"> - Full dApp compatibility</Text>
                <Button testID="light-account-button" className="mb-4" mode="contained" onPress={() => setAccountType("light")}>
                    Light Account
                </Button>
            </View>
            <View className="border rounded-md border-blue-400 p-8 pb-0 mb-2 w-3/4">
                <Text className="text-sm font-semibold mb-2"> - Limited dApp compatibility</Text>
                <Text className="text-sm font-semibold mb-2"> - Social Recovery Method</Text>
                <Button testID="pro-account-button" className="mb-4" mode="contained" onPress={() => setAccountType("multisig")}>
                    Pro Account
                </Button>
            </View>
        </SafeAreaView>
    )
}