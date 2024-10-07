import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Text,
  Menu,
  Divider,
  Card,
} from "react-native-paper";
import { useState, useEffect } from "react";
import { useLogout } from "../../../hooks/useLogout";
import { usePasskeyRegistration } from "../../../hooks/usePasskeyRegistration";
import { useUserPasskeys } from "../../../hooks/useUserPasskeys";
import styles from "../../../styles/styles";
import { theme } from "../../../styles/color";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useAuthContext } from "../../../providers/AuthProvider";
import { useAccountContext } from "../../../hooks/useAccountContext";
import { router } from "expo-router";

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
  const { user } = useAuthContext();
  const { initWalletForNetwork } = useAccountContext();

  const hasNoPasskeys = !passkeys?.length && !isLoading;
  const hasPasskeys = !!passkeys?.length;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const navigation = useNavigation();

  const handleNetworkChange = async (
    networkKey: string,
    networkName: string
  ) => {
    // @ts-ignore
    setNetwork(networkKey);
    setNetworkLabel(networkName);
    if (user) {
      await initWalletForNetwork(user, networkKey);
    } else {
      console.error(
        "User is null or undefined. Cannot initialize wallet for network."
      );
    }
    closeMenu();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "index" }],
      })
    );
  };

  useEffect(() => {
    const currentNetworkKey = blockchain?.name;
    if (currentNetworkKey && networkLabels[currentNetworkKey]) {
      setNetworkLabel(networkLabels[currentNetworkKey]);
    }
  }, [blockchain]);

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: "space-between",
        alignItems: "stretch",
      }}
    >
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
            onPress={() =>
              handleNetworkChange("optimismSepolia", "Optimism Sepolia")
            }
            title={"Optimism Sepolia"}
          />
          <Divider />
          <Menu.Item
            onPress={() =>
              handleNetworkChange("arbitrumSepolia", "Arbitrum Sepolia")
            }
            title={"Arbitrum Sepolia"}
          />
          <Divider />
          <Menu.Item
            onPress={() => handleNetworkChange("baseSepolia", "Base Sepolia")}
            title={"Base Sepolia"}
          />
        </Menu>
      </View>

      <Separator />

      {/* Passkeys Section */}
      <>
        <View style={{ flex: 1 }}>
          <Card>
            <Card.Content>
              <Text variant="titleMedium" style={styles.item}>
                Passkeys
              </Text>
              {hasNoPasskeys && (
                <Text style={settingsStyles.emptyText}>
                  You don't have any passkeys
                </Text>
              )}
              {hasPasskeys &&
                passkeys?.map((passkey) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{passkey.name.slice(0, 16) + "..."}</Text>
                    <Text>
                      {"Registered At: " +
                        passkey.registeredAt.toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              {isLoading && <ActivityIndicator />}
              <Button
                style={styles.button}
                mode="contained"
                onPress={() => register()}
                disabled={isLoading}
              >
                Register New Passkey
              </Button>
            </Card.Content>
          </Card>
        </View>
        <Separator />
        <Button style={styles.button} mode="outlined" onPress={logout}>
          Log Out
        </Button>

        <Button
          mode="outlined"
          style={styles.button}
          onPress={() => router.push({ pathname: "wallet-connect" })}
        >
          Connections
        </Button>
      </>
    </View>
  );
}

const Separator = () => (
  <View
    style={{ height: 1, backgroundColor: theme.colors.primary, width: "90%" }}
  />
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
