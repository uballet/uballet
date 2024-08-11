import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { useLogout } from "../../../hooks/useLogout";
import styles from "../../../styles/styles";
import { usePasskeyRegistration } from "../../../hooks/usePasskeyRegistration";
import { useUserPasskeys } from "../../../hooks/useUserPasskeys";
import { theme } from "../../../styles/color";

function SettingsScreen() {
  const logout = useLogout();
  const { register } = usePasskeyRegistration()
  const { passkeys, isLoading } = useUserPasskeys();

  const hasNoPasskeys = !passkeys?.length && !isLoading
  const hasPasskeys = !!passkeys?.length

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={settingsStyles.sectionContainer}>
        <Text style={settingsStyles.sectionHeader}>Passkeys</Text>
        {hasNoPasskeys && <Text style={settingsStyles.emptyText}>You don't have any passkeys</Text>}
        {hasPasskeys && passkeys?.map((passkey) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{passkey.name.slice(0, 16) + '...'}</Text>
            <Text>{'Registered At: ' + passkey.registeredAt.toLocaleDateString()}</Text>
          </View>
        ))}
        {isLoading && <ActivityIndicator />}
        <Button style={[styles.button, { width: "70%" }]} mode="outlined" onPress={() => register()} disabled={isLoading}>
          Register New Passkey
        </Button>
      </View>
      <Separator />
      <Button style={styles.button} onPress={logout}>
        Log Out
      </Button>
    </View>
  );
}

const Separator = () => <View style={{ height: 1, backgroundColor: theme.colors.primary, width: '90%' }} />;


const settingsStyles = StyleSheet.create({
    emptyText: {
      alignSelf: 'center'
    },
    sectionHeader: {
        alignSelf: 'center',
        fontSize: 18,
        marginBottom: 32,
        color: theme.colors.primary
    },
    sectionContainer: {
      width: '90%',
      padding: 8
    }
})

export default SettingsScreen;