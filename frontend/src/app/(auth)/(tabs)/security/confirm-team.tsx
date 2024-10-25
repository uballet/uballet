import { SafeAreaView, View } from "react-native";
import { useMyRecoveryTeam } from "../../../../hooks/recovery/useMyRecoveryTeam";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import useConfirmRecoveryTeam from "../../../../hooks/recovery/useConfirmRecoveryTeam";
import { Redirect, useRouter } from "expo-router";
import { useAccountContext } from "../../../../hooks/useAccountContext";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Address, formatEther } from "viem";
import { formatUoEstimation } from "../../../../hooks/useGasEstimation";


function useRecoveryTeamEstimation({ address1, address2 }: { address1?: Address; address2?: Address }) {
    const { initiator } = useAccountContext();
    const getTeamCreationEstimation = useCallback(async () => {
        if (!initiator || !address1 || !address2) return null
        const balance = await initiator.getBalance({
            address: initiator.getAddress()
        })
        const encodedTransfer = initiator.encodeUpdateOwnership({
            args: [[address1, address2], [], 2n]
        })

        const builtUo = await initiator.buildUserOperation({
            uo: encodedTransfer,
            context: {
                userOpSignatureType: "UPPERLIMIT"
            }
        })

        const isSponsored = await initiator.checkGasSponsorshipEligibility({
            uo: encodedTransfer
        })

        const { formatted, bigint: bigintEstimation } = await formatUoEstimation(builtUo)
        const isEnough = balance > bigintEstimation

        return {
            estimation: formatted.slice(0, 8) + ' ETH',
            balance: formatEther(balance).slice(0, 8) + ' ETH',
            isSponsored,
            isEnough
        }
    }, [initiator, address1, address2])

    const query = useQuery({
        queryKey: ['recovery-team-estimation', address1, address2],
        queryFn: getTeamCreationEstimation,
    })

    return query
}

export default function ConfirmTeamScreen() {
    const myTeamQuery = useMyRecoveryTeam();
    const confirmTeamMutation = useConfirmRecoveryTeam();
    const estimationQuery = useRecoveryTeamEstimation({ address1: myTeamQuery.data?.recoverer1Address, address2: myTeamQuery.data?.recoverer2Address })
    const router = useRouter();

    const loading = myTeamQuery.isLoading || estimationQuery.isLoading || estimationQuery.isFetching

    if (loading || !estimationQuery.data || !myTeamQuery.data) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </SafeAreaView>
        )
    }

    if (confirmTeamMutation.isSuccess) {
        return <Redirect href={'/(auth)/(tabs)/security'} />
    }

    return (
        <SafeAreaView className="items-center px-8">
            <Text className="text-xl font-semibold mt-8">
                Confirm Recovery Team
            </Text>
            <Card className="w-4/5 px-2 py-4 rounded-md mt-4">
                <Text>Gas Fee: {estimationQuery.data.estimation}</Text>
            </Card>
            <View className={`w-4/5 px-2 py-2 items-center rounded-md mt-2 ${estimationQuery.data.isSponsored ? "bg-green-300" : "bg-red-300"}`}>
                <Text>{estimationQuery.data.isSponsored ? "Sponsored Fee!" : "Not Sponsored - You'll pay for gas"}</Text>
            </View>
            <Card className="w-4/5 px-2 py-4 rounded-md mt-4">
                <Text>Current Balance: {estimationQuery.data.balance}</Text>
            </Card>

            <Card className="w-4/5 px-2 py-4 rounded-md mt-4">
                <Text>Recoverer 1: {myTeamQuery.data.recoverer1Email}</Text>
                <Text>Recoverer 2: {myTeamQuery.data.recoverer2Email}</Text>
            </Card>
            <Button
                testID="confirm-team-button"
                mode="contained"
                className="w-3/4 mt-4 self-center"
                disabled={(!estimationQuery.data.isEnough && !estimationQuery.data.isSponsored) || confirmTeamMutation.isPending}
                loading={confirmTeamMutation.isPending}
                onPress={() => confirmTeamMutation.mutate({ teamId: myTeamQuery.data.id, address1: myTeamQuery.data.recoverer1Address!, address2: myTeamQuery.data.recoverer2Address! })}
            >
                Confirm Team
            </Button>
            {!estimationQuery.data.isEnough && !estimationQuery.data.isSponsored && (
                <Text className="text-red-500 mt-1">Not enough balance</Text>
            )}
            <Button mode="outlined" className="w-3/4 mt-4 self-center" onPress={() => router.back()}>
                Go Back
            </Button>
        </SafeAreaView>
    )
}