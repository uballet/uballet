import { SafeAreaView, ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Card, Modal, Portal, Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { useMyRecoveryTeam } from "../../../../hooks/recovery/useMyRecoveryTeam";
import { useCreateRecoveryTeam } from "../../../../hooks/recovery/useCreateRecoveryTeam";
import { useRecoveryTeams } from "../../../../hooks/recovery/useRecoveryTeams";
import { useJoinRecoveryTeam } from "../../../../hooks/recovery/useJoinRecoveryTeam";
import { useRecoverAccount } from "../../../../hooks/recovery/useRecoverAccount";
import { useSignerStore } from "../../../../hooks/useSignerStore";
import { useAccountContext } from "../../../../hooks/useAccountContext";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { JoinedRecoveryTeam } from "../../../../api/uballet/types";

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
                    <Button testID="add-recovery-button" mode="contained" className="w-3/4 mt-4" onPress={() => onConfirm({ email1, email2 })} disabled={!email1 || !email2}>
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
                    testID="create-recovery-team-button"
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
            <View className="mt-2 w-full">
                <Card className="mb-4">
                    <Card.Content>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg">{recoverer1Email}</Text>
                            {recoverer1Address && <Ionicons name="checkmark-circle" size={24} color="green" />}
                            {!recoverer1Address && <Ionicons name="timer-outline" size={24} color="blue" />}
                        </View>
                        {!recoverer1Address && (
                            <Text className="text-sm text-red-400">Pending confirmation</Text>
                        )}
                    </Card.Content>
                </Card>
                <Card>
                    <Card.Content>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg">{recoverer2Email}</Text>
                            {recoverer2Address && <Ionicons className="text-c" name="checkmark-circle" size={24} color="green" />}
                            {!recoverer2Address && <Ionicons name="timer-outline" size={24} color="blue" />}
                        </View>
                        {!recoverer2Address && (
                            <Text className="text-sm text-red-400">Pending confirmation</Text>
                        )}
                    </Card.Content>
                </Card>
                {(!confirmed) && (
                    <>
                    <Button
                        testID="confirm-recovery-team-button"
                        disabled={!recoverer1Address || !recoverer2Address}
                        mode="contained"
                        className="w-3/4 mt-8 self-center"
                        onPress={() => router.navigate(`/(auth)/(tabs)/security/confirm-team`)}
                    >
                        Confirm
                    </Button>
                    {(!recoverer1Address || !recoverer2Address) && (
                        <Text testID="pending-recoverers-text" className="text-red-500 text-xs text-center mt-1">
                            We need confirmation from your recoverers first.
                        </Text>
                    )}
                    </>
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
    
    const onSignRecoveryForTeam = (team: JoinedRecoveryTeam) => () => {
        if (team.request?.aggregatedSignature) {
            router.navigate({ pathname: `/(auth)/(tabs)/security/complete-recovery`, params: { id: team.id } })
        } else {
            signRecoveryMutation.mutate({ recoveryTeam: team })
        }
    }

    const noProtect = !recoveryTeams.data?.joined.length && !recoveryTeams.data?.notJoined.length

    return (
        <>
        <Text className="text-xl font-semibold self-center mb-2">Who I Protect</Text>
        {noProtect && <Text className="text-lg self-center">No one to protect</Text>}
        {recoveryTeams.data?.notJoined.map((team) => (
            <Card key={team.id} className="rounded-lg w-full">
                <Card.Content>
                    <View className="flex-row justify-between items-center">
                        <View className="items-start">
                            <Text className="text-base">{team.email}</Text>
                            <Text testID="join-team-request-text" className="text-xs">wants to add you as recoverer</Text>
                        </View>
                        <Button testID="join-recovery-team-button" mode="contained" onPress={() => joinTeamMutation.mutate({ teamId: team.id })}>Accept</Button>
                    </View>
                </Card.Content>
            </Card>
        ))}
        {recoveryTeams.data?.joined.map((team) => (
            <Card key={team.id} className={`rounded-lg mt-2 ${team.request?.needToSign ? "bg-red-300" : ""}`}>
                <Card.Content>
                    <View className="flex-row justify-between w-full">
                        <View className="items-start">
                            <Text className="text-base" key={team.id}>{team.email}</Text>
                            {team.request?.needToSign
                            ? <Text testID="action-required-text" className="text-xs flex-wrap">Recovery has been requested</Text>
                            : <Text testID="no-action-required-text" className="text-xs">No Action Required</Text>
                        }
                        </View>
                        <View className="items-center justify-center">
                            {team.request?.needToSign ? (
                                <Button
                                    testID="sign-recovery-button"
                                    mode="contained"
                                    disabled={signRecoveryMutation.isPending}
                                    loading={signRecoveryMutation.isPending}
                                    className="self-center"
                                    onPress={onSignRecoveryForTeam(team)}
                                >
                                        Recover
                                </Button>
                            ) : (
                                <Ionicons name="checkmark-circle" size={24} color="green" />
                            )}
                        </View>
                    </View>
                </Card.Content>
            </Card>
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