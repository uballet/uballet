import { Text, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useLogout } from "../../../hooks/useLogout";
import { useMyRecoveryTeam } from "../../../hooks/recovery/useMyRecoveryTeam";
import { useMyRecoveryRequest } from "../../../hooks/recovery/useMyRecoveryRequest";

export default function AccountRecoveryScreen() {
    const logout = useLogout()
    const router = useRouter();
    const myTeamQuery = useMyRecoveryTeam()
    const myRecoveryRequestQuery = useMyRecoveryRequest()
    if (myTeamQuery.isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        )
    }
    const requestExists = !!myRecoveryRequestQuery.data?.id
    const disabledRequestButton = myRecoveryRequestQuery.isLoading || myRecoveryRequestQuery.data?.id

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="m-4">Account Recovery</Text>
            <Button mode="contained" className="m-4 w-2/3" onPress={() => router.replace('/(auth)/account-recovery/seedphrase')}>
                <Text>Recover with seedphrase</Text>
            </Button>
            {myTeamQuery.data?.confirmed && (
                <Button testID="contact-recovery-team-button" mode="contained" disabled={!!disabledRequestButton} className="m-4 w-2/3" onPress={() => router.replace('/(auth)/account-recovery/recovery-team')}>
                    <Text>{requestExists ? "Recovery Request Sent" : "Contact Recovery Team"}</Text>
                </Button>
            )}
            <Button testID="logout-button" mode="outlined" className="m-4 w-2/3" onPress={logout}>
                <Text className="text-red-700">Log Out</Text>
            </Button>
        </View>
    )
}