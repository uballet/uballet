import { SafeAreaView, ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { useMyRecoveryTeam } from "../../../../hooks/recovery/useMyRecoveryTeam";
import { useCreateRecoveryTeam } from "../../../../hooks/recovery/useCreateRecoveryTeam";
import { useRecoveryTeams } from "../../../../hooks/recovery/useRecoveryTeams";
import { useJoinRecoveryTeam } from "../../../../hooks/recovery/useJoinRecoveryTeam";
import { useRecoverAccount } from "../../../../hooks/recovery/useRecoverAccount";
import { useSignerStore } from "../../../../hooks/useSignerStore";
import { useAccountContext } from "../../../../hooks/useAccountContext";
import { useRouter } from "expo-router";

interface RecoveryModalProps {
    onConfirm: ({ email1, email2 }: { email1: string; email2: string }) => void
    onDismiss: () => void
    visible: boolean
}
function AddRecoveryModal({ onConfirm, visible, onDismiss }: RecoveryModalProps) {
    const [email1, setEmail1] = useState('')
    const [email2, setEmail2] = useState('')
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss}>
                <View className="items-center self-center p-8 w-4/5 justify-center bg-white">
                    <TextInput
                        className="w-3/4"
                        placeholder="Recoverer 1 Email"
                        mode="outlined"
                        value={email1}
                        onChangeText={val => setEmail1(val.toLowerCase())}
                        autoCapitalize="none"
                    />
                    <TextInput
                        className="w-3/4 mt-4"
                        placeholder="Recoverer 2 Email"
                        mode="outlined"
                        value={email2}
                        onChangeText={val => setEmail2(val.toLowerCase())}
                        autoCapitalize="none"
                    />
                    <Button mode="contained" className="w-3/4 mt-4" onPress={() => onConfirm({ email1, email2 })} disabled={!email1 || !email2}>
                        Add Recovery
                    </Button>
                </View>
            </Modal>
        </Portal>
    )
}

function RecoveryCodeSection() {
    const [modalVisible, setModalVisible] = useState(false);
    const { loadSeedphrase } = useSignerStore()
    const [code, setCode] = useState('')

    useEffect(() => {
        if (!modalVisible) {
            setCode('')
        }
    }, [modalVisible])

    const onOpenModal = () => {
        setModalVisible(true)
        loadSeedphrase().then(code => setCode(code!))
    }
    return (
        <View>
            <Text className="text-xl font-semibold self-center">Recovery Code</Text>
            <Button
                mode="contained"
                className="w-3/4 mt-4 self-center"
                onPress={onOpenModal}
            >
                View Recovery Code
            </Button>
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                    <View className="items-center self-center p-4 m-4 rounded justify-center bg-white">
                        <Text className="text-lg">Recovery Code</Text>
                        {code && (
                            <>
                                <Text className="text-lg max-h-32 mt-4 p-4 bg-gray-200 items-center">
                                    {code}
                                </Text>
                                <Button mode="contained" className="w-3/4 mt-4" onPress={() => {}}>
                                    Copy
                                </Button>
                            </>
                        )}
                        {!code && <ActivityIndicator />}
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}

function MyRecoveryTeam() {
    const [modalVisible, setModalVisible] = useState(false);
    const myTeam = useMyRecoveryTeam()
    const createRecoveryTeam = useCreateRecoveryTeam()
    const { accountType } = useAccountContext()
    const router = useRouter();

    useEffect(() => {
        if (createRecoveryTeam.isSuccess) {
            setModalVisible(false)
        }
    }, [createRecoveryTeam.isSuccess])

    if (myTeam.isLoading) {
        return <ActivityIndicator />
    }

    if (!myTeam.data) {
        return (
            <View className="flex-1 max-h-full">
                <Text className="text-xl font-semibold self-center">My Recovery Team</Text>
                <Button
                    mode="contained"
                    className="w-3/4 mt-4 self-center"
                    disabled={accountType !== "multisig"}
                    onPress={() => setModalVisible(true)}
                >
                    Create Recovery Team
                </Button>
                {accountType !== "multisig" && (
                    <Text className="text-red-700 text-center mt-4">
                        You need a Pro account for this
                    </Text>
                )}
                <AddRecoveryModal
                    onConfirm={({ email1, email2 }) => createRecoveryTeam.mutate({ email1, email2 })}
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                />
            </View>
        )
    }

    const { recoverer1Email, recoverer1Address, recoverer2Email, recoverer2Address, confirmed, id } = myTeam.data
    return (
        <View className="flex-1 p-4">
            <Text className="text-xl font-semibold self-center">
                My Recovery Team
            </Text>
            <View className="border p-4 rounded-md mt-2">
                <View className="flex-row">
                    <Text className="text-lg">Recoverer 1: {recoverer1Email}</Text>
                </View>
                <View className="flex-row">
                    <Text className="text-lg">Recoverer 2: {recoverer2Email}</Text>
                </View>
                {(!recoverer1Address || !recoverer2Address) && (
                    <View className="flex-row">
                        <Text className="text-sm text-red-400">Pending confirmation from recoverers</Text>
                    </View>
                )}
                {(recoverer1Address && recoverer2Address && !confirmed) && (
                    <Button
                        mode="contained"
                        className="w-3/4 mt-4"
                        onPress={() => router.navigate(`/(auth)/(tabs)/security/confirm-team`)}
                    >
                        Confirm
                    </Button>
                )}
            </View>
        </View>
    )
}

function WhoIProtectSection() {
    const recoveryTeams = useRecoveryTeams()
    const joinTeamMutation = useJoinRecoveryTeam()
    const signRecoveryMutation = useRecoverAccount();
    const router = useRouter();
    
    if (recoveryTeams.isLoading) {
        return <ActivityIndicator />
    }

    const noProtect = !recoveryTeams.data?.joined.length && !recoveryTeams.data?.notJoined.length

    return (
        <>
        <Text className="text-xl font-semibold self-center">Who I Protect</Text>
        {noProtect && <Text className="text-lg self-center">No one to protect</Text>}
        {recoveryTeams.data?.notJoined.map((team) => (
            <View key={team.id} className="items-center rounded-lg p-4 w-full border">
                <View className="flex-row items-center">
                    <Text className="text-lg">{team.email}</Text>
                    <Text className="text-sm p-2">wants to add you as recoverer</Text>
                </View>
                <View className="flex-row justify-between">
                    <Button mode="contained" onPress={() => joinTeamMutation.mutate({ teamId: team.id })}>Accept</Button>
                </View>
            </View>
        ))}
        {recoveryTeams.data?.joined.map((team) => (
            <View key={team.id} className="flex-row justify-between items-center rounded-lg p-4 w-full border mt-2">
                <Text className="text-lg" key={team.id}>{team.email}</Text>
                {team.request?.needToSign ? (
                    <Button
                        disabled={signRecoveryMutation.isPending}
                        loading={signRecoveryMutation.isPending}
                        onPress={() => {
                            if (team.request?.aggregatedSignature) {
                                router.navigate({ pathname: `/(auth)/(tabs)/security/complete-recovery`, params: { id: team.id } })
                            } else {
                                signRecoveryMutation.mutate({ recoveryTeam: team })
                            }
                        }} mode="contained"
                    >
                            Sign Recovery
                    </Button>
                ) : (
                <Text className="text-sm ml-2">No Action Required</Text>
                )}
            </View>
        ))}
        </>
    )
}
export default function SecurityScreen() {
    return (
        <SafeAreaView className="flex-1 p-4 overflow-hidden">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 8 }}>
                <View className="w-5/6 m-4 py-4 border-b self-center">
                    <WhoIProtectSection />
                </View>
                <View className="w-5/6 flex-1 mt-4 pb-4 mx-4 border-b self-center">
                    <MyRecoveryTeam />
                </View>
                <View className="w-full flex-1 mt-4">
                    <RecoveryCodeSection />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}