import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router"
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecoveredScreen() {
    const { user, done } = useLocalSearchParams<{ user: string, done?: "true" }>();
    const router = useRouter();
    if (done) {
        return (
            <SafeAreaView className="h-full items-center px-8 justify-center">
                <Text testID="recovery-complete-text" variant="labelLarge" className="text-xl font-semibold my-8">
                    Account successfully recovered!
                </Text>
                <Ionicons className="mt-8" name="checkmark-circle" size={64} color="green" />
                <Button className="mt-8" mode="contained" onPress={() => router.replace("/(auth)/(tabs)/security/")}>Back</Button>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="items-center px-8">
            <Text testID="recovery-in-progress-text" variant="labelLarge" className="text-xl font-semibold mt-8">
                Recovery in progress for {user}
            </Text>
            <Text variant="labelMedium" className="my-8">
                Recovery process might takes a few minutes to finish.
            </Text>
            <Ionicons name="timer" size={64} color="blue" />
            <Button className="mt-8" mode="contained" onPress={() => router.replace("/(auth)/(tabs)/security/")}>Back</Button>
        </SafeAreaView>
    )
}