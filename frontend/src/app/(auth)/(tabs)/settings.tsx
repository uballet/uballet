import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, Menu, Divider } from "react-native-paper";
import { useState } from "react";
import { useLogout } from "../../../hooks/useLogout";
import { usePasskeyRegistration } from "../../../hooks/usePasskeyRegistration";
import { useUserPasskeys } from "../../../hooks/useUserPasskeys";
import { theme } from "../../../styles/color";
import { useAuthContext } from "../../../providers/AuthProvider";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAccountContext } from "../../../hooks/useAccountContext";

const networkLabels: Record<string, string> = {
  arbitrum: "Arbitrum",
  arbitrumSepolia: "Arbitrum Sepolia",
  base: "Base",
  baseSepolia: "Base Sepolia",
  mainnet: "Ethereum",
  optimism: "Optimism",
  optimismSepolia: "Optimism Sepolia",
  sepolia: "Sepolia",
};

function getNetworkName(networkKey: string) {
  if (networkLabels[networkKey]) {
    return networkLabels[networkKey]
  } else {
    return networkKey;
  }
}

function SettingsScreen() {
  const logout = useLogout();
  const { register } = usePasskeyRegistration();
  const { passkeys, isLoading } = useUserPasskeys();
  const { setNetwork, blockchain } = useBlockchainContext();
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuthContext();

  const networkLabel = getNetworkName(blockchain?.name);
  const hasNoPasskeys = !passkeys?.length && !isLoading;
  const hasPasskeys = !!passkeys?.length;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const navigation = useNavigation();

  const handleNetworkChange = async (networkKey: string) => {
    // @ts-ignore
    setNetwork(networkKey);
    closeMenu();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'index' }],
      })
    );
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* Network Selection Section */}
      <View style={settingsStyles.sectionContainer}>
        <Text style={settingsStyles.sectionHeader}>Network selection</Text>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Button
              mode="outlined"
              onPress={openMenu}
              contentStyle={{ justifyContent: "space-between" }}
              style={settingsStyles.networkDropdown}
            >
              {networkLabel}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => handleNetworkChange("sepolia")}
            title={getNetworkName("sepolia")}
          />
          <Divider />
          <Menu.Item
            onPress={() => handleNetworkChange("optimismSepolia")}
            title={getNetworkName("optimismSepolia")}
          />
          <Divider />
          <Menu.Item
            onPress={() => handleNetworkChange("arbitrumSepolia")}
            title={getNetworkName("arbitrumSepolia")}
          />
          <Divider />
          <Menu.Item
            onPress={() => handleNetworkChange("baseSepolia")}
            title={getNetworkName("baseSepolia")}
          />
         
        </Menu>
      </View>

      <Separator />

      {/* Passkeys Section */}
      <View style={settingsStyles.sectionContainer}>
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

const Separator = () => (
  <View style={{ height: 1, backgroundColor: theme.colors.primary, width: "90%" }} />
);

const settingsStyles = StyleSheet.create({
  emptyText: {
    alignSelf: "center",
  },
  sectionHeader: {
    alignSelf: "center",
    fontSize: 18,
    marginTop: 12,
    marginBottom: 22,
    color: theme.colors.primary,
  },
  sectionContainer: {
    width: "90%",
    padding: 8,
  },
  networkDropdown: {
    width: "70%",
    alignSelf: "center",
    marginVertical: 16,
  },
});

export default SettingsScreen;
