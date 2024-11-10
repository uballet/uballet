import { SafeAreaView, ScrollView, View } from "react-native";
import {
  Button,
  Card,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
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
import styles from "../../../../styles/styles";
import UballetSpinner from "../../../../components/UballetSpinner/UballetSpinner";
import { theme } from "../../../../styles/color";

interface RecoveryModalProps {
  onConfirm: ({ email1, email2 }: { email1: string; email2: string }) => void;
  onDismiss: () => void;
  visible: boolean;
}
function AddRecoveryModal({
  onConfirm,
  visible,
  onDismiss,
}: RecoveryModalProps) {
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}>
        <View className="items-center self-center p-8 w-4/5 justify-center bg-white">
          <TextInput
            className="w-3/4"
            placeholder="Recoverer 1 Email"
            mode="outlined"
            value={email1}
            onChangeText={(val) => setEmail1(val.toLowerCase())}
            autoCapitalize="none"
          />
          <TextInput
            className="w-3/4 mt-4"
            placeholder="Recoverer 2 Email"
            mode="outlined"
            value={email2}
            onChangeText={(val) => setEmail2(val.toLowerCase())}
            autoCapitalize="none"
          />
          <Button
            testID="add-recovery-button"
            mode="contained"
            className="w-3/4 mt-4"
            onPress={() => onConfirm({ email1, email2 })}
            disabled={!email1 || !email2}
          >
            Add Recovery
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

function MyRecoveryTeam() {
  const [modalVisible, setModalVisible] = useState(false);
  const myTeam = useMyRecoveryTeam();
  const createRecoveryTeam = useCreateRecoveryTeam();
  const { accountType } = useAccountContext();
  const router = useRouter();

  useEffect(() => {
    if (createRecoveryTeam.isSuccess) {
      setModalVisible(false);
    }
  }, [createRecoveryTeam.isSuccess]);

  if (myTeam.isLoading) {
    return <UballetSpinner />;
  }

  if (!myTeam.data) {
    return (
      <Card>
        <Card.Title titleVariant="titleMedium" title="My Recovery Team" />
        <Card.Content>
          <Button
            testID="create-recovery-team-button"
            mode="contained"
            style={{ ...styles.button, marginTop: 5 }}
            disabled={accountType !== "multisig"}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: "#fff" }}>Create Recovery Team </Text>
          </Button>
          {accountType !== "multisig" && (
            <Text className="text-red-700 text-center mt-0">
              You need a Pro account for this
            </Text>
          )}
          <AddRecoveryModal
            onConfirm={({ email1, email2 }) =>
              createRecoveryTeam.mutate({ email1, email2 })
            }
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
          />
        </Card.Content>
      </Card>
    );
  }

  const {
    recoverer1Email,
    recoverer1Address,
    recoverer2Email,
    recoverer2Address,
    confirmed,
    id,
  } = myTeam.data;
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
              {recoverer1Address && (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              )}
              {!recoverer1Address && (
                <Ionicons name="timer-outline" size={24} color="blue" />
              )}
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
              {recoverer2Address && (
                <Ionicons
                  className="text-c"
                  name="checkmark-circle"
                  size={24}
                  color="green"
                />
              )}
              {!recoverer2Address && (
                <Ionicons name="timer-outline" size={24} color="blue" />
              )}
            </View>
            {!recoverer2Address && (
              <Text className="text-sm text-red-400">Pending confirmation</Text>
            )}
          </Card.Content>
        </Card>
        {!confirmed && (
          <>
            <Button
              testID="confirm-recovery-team-button"
              disabled={!recoverer1Address || !recoverer2Address}
              mode="contained"
              className="w-3/4 mt-8 self-center"
              onPress={() =>
                router.navigate(`/(auth)/(tabs)/security/confirm-team`)
              }
            >
              Confirm
            </Button>
            {(!recoverer1Address || !recoverer2Address) && (
              <Text
                testID="pending-recoverers-text"
                className="text-red-500 text-xs text-center mt-1"
              >
                We need confirmation from your recoverers first.
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
}

function WhoIProtectSection() {
  const recoveryTeams = useRecoveryTeams();
  const joinTeamMutation = useJoinRecoveryTeam();
  const signRecoveryMutation = useRecoverAccount();
  const router = useRouter();

  if (recoveryTeams.isLoading) {
    return <UballetSpinner />;
  }

  const onSignRecoveryForTeam = (team: JoinedRecoveryTeam) => () => {
    if (team.request?.aggregatedSignature) {
      router.navigate({
        pathname: `/(auth)/(tabs)/security/complete-recovery`,
        params: { id: team.id },
      });
    } else {
      signRecoveryMutation.mutate({ recoveryTeam: team });
    }
  };

  const noProtect =
    !recoveryTeams.data?.joined.length && !recoveryTeams.data?.notJoined.length;

  if (noProtect) {
    return (
      <Card>
        <Card.Title titleVariant="titleMedium" title="Who I Protect" />
        <Card.Content>
          <Text className=" self-center">No one to protect right now</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Title titleVariant="titleMedium" title="Who I Protect" />
        <Card.Content>
          {recoveryTeams.data?.notJoined.map((team) => (
            <Card key={team.id} className="rounded-lg w-full">
              <Card.Content>
                <View className="flex-row justify-between items-center">
                  <View className="items-start">
                    <Text className="text-base">{team.email}</Text>
                    <Text testID="join-team-request-text" className="text-xs">
                      wants to add you as recoverer
                    </Text>
                  </View>
                  <Button
                    testID="join-recovery-team-button"
                    mode="contained"
                    onPress={() => joinTeamMutation.mutate({ teamId: team.id })}
                  >
                    Accept
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
          {recoveryTeams.data?.joined.map((team) => (
            <Card
              key={team.id}
              className={`rounded-lg mt-2 ${
                team.request?.needToSign ? "bg-red-300" : ""
              }`}
            >
              <Card.Content>
                <View className="flex-row justify-between w-full">
                  <View className="items-start">
                    <Text className="text-base" key={team.id}>
                      {team.email}
                    </Text>
                    {team.request?.needToSign ? (
                      <Text
                        testID="action-required-text"
                        className="text-xs flex-wrap"
                      >
                        Recovery has been requested
                      </Text>
                    ) : (
                      <Text
                        testID="no-action-required-text"
                        className="text-xs"
                      >
                        No Action Required
                      </Text>
                    )}
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
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="green"
                      />
                    )}
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
    </>
  );
}

const Separator = () => (
  <View
    style={{
      height: 1,
      backgroundColor: theme.colors.primary,
      width: "100%",
      marginVertical: 16,
    }}
  />
);

export default function SecurityScreen() {
  return (
    <SafeAreaView className="flex-1 overflow-hidden">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <View
          style={{
            ...styles.container,
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <View className="self-center w-full">
            <MyRecoveryTeam />
          </View>
          <Separator />
          <View>
            <WhoIProtectSection />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
