import { View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { useLogout } from "../../../hooks/useLogout";
import styles from "../../../styles/styles";
import { usePasskeyRegistration } from "../../../hooks/usePasskeyRegistration";
import { useUserPasskeys } from "../../../hooks/useUserPasskeys";
import { theme } from "../../../styles/color";
import { useAuthContext } from "../../../providers/AuthProvider";

function SettingsScreen() {
  const logout = useLogout();
  const { register } = usePasskeyRegistration()
  const { passkeys, isLoading } = useUserPasskeys();
  const { user } = useAuthContext();

  const hasNoPasskeys = !passkeys?.length && !isLoading
  const hasPasskeys = !!passkeys?.length

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View className="w-5/6 p-8">
        <Text className="text-xl mb-8 self-center">Passkeys</Text>
        {hasNoPasskeys && <Text className="self-center">You don't have any passkeys</Text>}
        {hasPasskeys && passkeys?.map((passkey) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{passkey.name.slice(0, 16) + '...'}</Text>
            <Text>{'Registered At: ' + passkey.registeredAt.toLocaleDateString()}</Text>
          </View>
        ))}
        {isLoading && <ActivityIndicator />}
        <Button mode="contained" className="m-4" onPress={() => register()} disabled={isLoading}>
          Register New Passkey
        </Button>
      </View>
      <Separator />
      <View className="p-4">
        <Text className="text-xl mb-8 self-center">{`Account Type: ${user?.walletType === 'light' ? 'Light' : 'Pro'}`} </Text>
        {user?.walletType === 'light' && <Button mode="contained" className="mb-4" onPress={() =>{}}>Upgrade to Pro</Button>}
      </View>
      <Separator />
      <Button mode="outlined" className="m-8" onPress={logout}>
        <Text className="text-red-500">Logout</Text>
      </Button>
    </View>
  );
}

const Separator = () => <View style={{ height: 1, backgroundColor: theme.colors.primary, width: '90%' }} />;

export default SettingsScreen;
