import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Text,
  Menu,
  Divider,
  Card,
} from "react-native-paper";
import { useState } from "react";
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

function getNetworkName(networkKey: string) {
  if (networkLabels[networkKey]) {
    return networkLabels[networkKey];
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
        routes: [{ name: "index" }],
      })
    );
  };

  return (
    <ScrollView>
      <View
        style={{
          ...styles.container,
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        {/* Network Selection Section */}
        <Card>
          <Card.Title titleVariant="titleMedium" title="Network selection" />
          <Card.Content>
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <Button
                  mode="outlined"
                  onPress={openMenu}
                  contentStyle={{
                    ...styles.button,
                    padding: 1,
                    margin: 0,
                  }}
                >
                  {networkLabel}
                </Button>
              }
            >
              <Menu.Item
                onPress={() => handleNetworkChange("sepolia")}
                title={"Sepolia"}
              />
              <Divider />
              <Menu.Item
                onPress={() => handleNetworkChange("optimismSepolia")}
                title={"Optimism Sepolia"}
              />
              <Divider />
              <Menu.Item
                onPress={() => handleNetworkChange("arbitrumSepolia")}
                title={"Arbitrum Sepolia"}
              />
              <Divider />
              <Menu.Item
                onPress={() => handleNetworkChange("baseSepolia")}
                title={"Base Sepolia"}
              />
            </Menu>
          </Card.Content>
        </Card>

        <Separator />

        {/* Passkeys Section */}
        <Card>
          <Card.Title titleVariant="titleMedium" title="Passkeys" />
          <Card.Content>
            {hasNoPasskeys && (
              <Text className="self-center">You don't have any passkeys</Text>
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
              mode="contained"
              style={styles.button}
              onPress={() => register()}
              disabled={isLoading}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {" "}
                Register New Passkey{" "}
              </Text>
            </Button>
          </Card.Content>
        </Card>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Separator />
          <Button
            mode="contained-tonal"
            style={{
              ...settingsStyles.settingButtons,
              backgroundColor: theme.colors.primary,
            }}
            textColor="white"
            onPress={() => router.push({ pathname: "wallet-connect" })}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {" "}
              Connections{" "}
            </Text>
          </Button>
          <Button
            testID="logout-button"
            mode="outlined"
            style={{
              ...settingsStyles.settingButtons,
              backgroundColor: "white",
            }}
            onPress={logout}
          >
            <Text className="text-red-700 font-bold">Logout</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
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

const settingsStyles = StyleSheet.create({
  networkDropdown: {
    width: "70%",
    alignSelf: "center",
    marginVertical: 16,
  },
  settingButtons: {
    ...styles.button,
    marginVertical: 8,
  },
});

export default SettingsScreen;
