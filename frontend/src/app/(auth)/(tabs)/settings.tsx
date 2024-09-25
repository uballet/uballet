import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, Menu, Divider } from "react-native-paper";
import { useState, useEffect } from "react";
import { useLogout } from "../../../hooks/useLogout";
import styles from "../../../styles/styles";
import { usePasskeyRegistration } from "../../../hooks/usePasskeyRegistration";
import { useUserPasskeys } from "../../../hooks/useUserPasskeys";
import { theme } from "../../../styles/color";
import { useBlockchainContext } from "../../../providers/BlockchainProvider"; // Import context

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

function SettingsScreen() {
  const logout = useLogout();
  const { register } = usePasskeyRegistration();
  const { passkeys, isLoading } = useUserPasskeys();
  const { setNetwork, blockchain } = useBlockchainContext();
  const [networkLabel, setNetworkLabel] = useState(blockchain.name);
  const [menuVisible, setMenuVisible] = useState(false);

  const hasNoPasskeys = !passkeys?.length && !isLoading;
  const hasPasskeys = !!passkeys?.length;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleNetworkChange = (networkKey: string, networkName: string) => {
     // @ts-ignore
    setNetwork(networkKey);
    setNetworkLabel(networkName);
    closeMenu();
  };

  useEffect(() => {
    const currentNetworkKey = blockchain?.name;
    if (currentNetworkKey && networkLabels[currentNetworkKey]) {
      setNetworkLabel(networkLabels[currentNetworkKey]);
    }
  }, [blockchain]);

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
            onPress={() => handleNetworkChange("sepolia", "Sepolia")}
            title={"Sepolia"}
          />
          <Divider />
          <Menu.Item
            onPress={() => handleNetworkChange("optimismSepolia", "Optimism Sepolia")}
            title={"Optimism Sepolia"}
          />
          <Menu.Item
            onPress={() => handleNetworkChange("arbitrumSepolia", "Arbitrum Sepolia")}
            title={"Arbitrum Sepolia"}
          />
          {/* <Menu.Item
            onPress={() => handleNetworkChange("baseSepolia", "Base Sepolia")}
            title={"Base Sepolia"}
          />
          */}
        </Menu>
      </View>

      <Separator />

      {/* Passkeys Section */}
      <View style={settingsStyles.sectionContainer}>
        <Text style={settingsStyles.sectionHeader}>Passkeys</Text>
        {hasNoPasskeys && (
          <Text style={settingsStyles.emptyText}>You don't have any passkeys</Text>
        )}
        {hasPasskeys &&
          passkeys?.map((passkey) => (
            <View key={passkey.id} style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text>{passkey.name.slice(0, 16) + "..."}</Text>
              <Text>
                {"Registered At: " + passkey.registeredAt.toLocaleDateString()}
              </Text>
            </View>
          ))}
        {isLoading && <ActivityIndicator />}
        <Button
          style={[styles.button, { width: "70%" }]}
          mode="outlined"
          onPress={() => register()}
          disabled={isLoading}
        >
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
