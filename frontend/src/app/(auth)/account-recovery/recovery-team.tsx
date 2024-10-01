import { SafeAreaView, View } from "react-native";
import { useMyRecoveryTeam } from "../../../hooks/recovery/useMyRecoveryTeam"
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { useRequestRecovery } from "../../../hooks/recovery/useRequestRecovery";
import { useMyRecoveryRequest } from "../../../hooks/recovery/useMyRecoveryRequest";
import { useRequestRecoveryEstimation } from "../../../hooks/recovery/useRequestRecoveryEstimation";
import { MaterialIcons } from "@expo/vector-icons";

export default function RecoverWithTeamScreen() {
    const myRecoveryTeamQuery = useMyRecoveryTeam();
    const requestRecoveryMutation = useRequestRecovery()
    const myRecoveryRequestQuery = useMyRecoveryRequest()
    const estimationQuery = useRequestRecoveryEstimation();
    const loading = myRecoveryTeamQuery.isLoading || myRecoveryRequestQuery.isLoading || estimationQuery.isLoading
    
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        )
    }
    const { data: myRecoveryTeam } = myRecoveryTeamQuery
    const { data: myRecoveryRequest } = myRecoveryRequestQuery
    const pendingRequest = myRecoveryRequest?.id
    const isEnough = estimationQuery.data?.isEnough
    return (
        <SafeAreaView className="flex-1 items-center">
            <Text className="m-4 text-lg font-semibold">Recover with Recovery Team</Text>
            <View className="w-3/4 p-4 border rounded-md mt-4">
                <Text className="text-lg font-bold">Estimated Recovery Fee</Text>
                <Text className="text-xl font-bold">{estimationQuery.data?.estimation.slice(0, 8)} ETH</Text>
            </View>
            <View className="w-3/4 p-4 border rounded-md mt-4 flex-row justify-between">
                <View>
                    <Text className="text-lg font-bold">Current Balance</Text>
                    <Text className="text-xl font-bold">{estimationQuery.data?.currentBalance.slice(0, 8)} ETH</Text>
                </View>
                <View className="justify-center items-center pr-8">
                    {isEnough && <MaterialIcons name="check-circle-outline" size={36} color="green" />}
                    {!isEnough && <MaterialIcons name="cancel" size={36} color="red" />}
                </View>
            </View>
            {!isEnough && <Text className="text-red-500 mt-2">Not enough balance to request recovery</Text>}
            <View className="w-3/4 mt-4">
                <Text className="text-xl font-semibold my-4">Recovery Team</Text>
                <Text className="text-lg">· Recoverer 1: {myRecoveryTeam?.recoverer1Email}</Text>
                <Text className="text-lg">· Recoverer 2: {myRecoveryTeam?.recoverer2Email}</Text>
            </View>
            {myRecoveryTeam && !pendingRequest && (
                <Button mode="contained" disabled={requestRecoveryMutation.isPending || !isEnough} loading={requestRecoveryMutation.isPending} className="w-3/4 mt-8" onPress={() => requestRecoveryMutation.mutate()}>
                    Request Recovery
                </Button>
            )}
            {pendingRequest && <Text className="text-red-500">Your Recovery is in process - Contact your team</Text>}
        </SafeAreaView>
    )
}