import { SafeAreaView, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useAccountContext } from "../../../../hooks/useAccountContext";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Address, formatEther } from "viem";
import { formatUoEstimation } from "../../../../hooks/useGasEstimation";
import { useRecoveryTeams } from "../../../../hooks/recovery/useRecoveryTeams";
import { useRecoverAccount } from "../../../../hooks/recovery/useRecoverAccount";


function useRecoveryEstimation({ address1, address2, recoveryAddress }: { recoveryAddress?: Address; address1?: Address; address2?: Address }) {
    const { createMultsigClient, lightAccount, initiator } = useAccountContext();
    const getRecoveryEstimation = useCallback(async () => {
        if (!address1 || !address2 || !recoveryAddress) return null
        const account = lightAccount || initiator
        const signer = account!.account.getSigner()
        const recoveryClient = await createMultsigClient(signer, recoveryAddress)

        const balance = await recoveryClient.getBalance({
            address: recoveryClient.getAddress()
        })
        const encodedTransfer = recoveryClient.encodeUpdateOwnership({
            args: [[address1, address2], [], 2n]
        })

        const builtUo = await recoveryClient.buildUserOperation({
            uo: encodedTransfer,
            context: {
                userOpSignatureType: "UPPERLIMIT"
            }
        })

        const { formatted, bigint: bigintEstimation } = await formatUoEstimation(builtUo)
        const isEnough = balance > bigintEstimation

        return {
            estimation: formatted.slice(0, 8) + ' ETH',
            balance: formatEther(balance).slice(0, 8) + ' ETH',
            isEnough
        }
    }, [initiator, address1, address2])

    const query = useQuery({
        queryKey: ['account-recovery-estimation', address1, address2],
        queryFn: getRecoveryEstimation,
    })

    return query
}

export default function CompleteRecoveryScreen() {
    const { id } = useLocalSearchParams();
    const recoveryTeams = useRecoveryTeams();
    
    const team = recoveryTeams.data?.joined.find(team => team.id === id)
    const estimationQuery = useRecoveryEstimation({ address1: team?.request?.newAddress1, address2: team?.request?.newAddress2, recoveryAddress: team?.request?.walletAddress })
    const recoverAccountMutation = useRecoverAccount();
    const router = useRouter();

    const loading = recoveryTeams.isLoading || estimationQuery.isLoading || estimationQuery.isFetching

    if (loading || !estimationQuery.data || !recoveryTeams.data) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </SafeAreaView>
        )
    }

    if (!team) {
        return <Redirect href={'/(auth)/(tabs)/security'} />
    }

    return (
        <SafeAreaView className="items-center px-8">
            <Text className="text-xl mt-8 font-semibold">
                Complete Account Recovery
            </Text>
            <Text className="text-base mt-4">
                Recovering {team.email}
            </Text>
            <Card className="w-4/5 px-2 py-4 rounded-md mt-4">
                <Text>Gas Fee: {estimationQuery.data.estimation}</Text>
            </Card>
            <Card className="w-4/5 px-2 py-4 rounded-md mt-4">
                <Text>Current Balance: {estimationQuery.data.balance}</Text>
            </Card>
            <Text className="text-base mt-4">
                Gas will be paid by the recovered account
            </Text>
            <View className="mt-8 w-full">
                <Button
                    testID="complete-recovery-button"
                    mode="contained"
                    className="w-3/4 mt-4 self-center"
                    disabled={!estimationQuery.data.isEnough || recoverAccountMutation.isPending}
                    loading={recoverAccountMutation.isPending}
                    onPress={() => recoverAccountMutation.mutate({ recoveryTeam: team })}
                >
                    Complete Recovery
                </Button>
                {!estimationQuery.data.isEnough && (
                    <Text className="text-red-500 mt-1">Not enough balance. Transfer more ETH to complete recovery</Text>
                )}
                <Button mode="outlined" className="w-3/4 mt-4 self-center" onPress={() => router.back()}>
                    Go Back
                </Button>
            </View>
        </SafeAreaView>
    )
}