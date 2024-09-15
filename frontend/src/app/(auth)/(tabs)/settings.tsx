import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useLogout } from "../../../hooks/useLogout";
import styles from "../../../styles/styles";
import { usePasskeyRegistration } from "../../../hooks/usePasskeyRegistration";
import { useUserPasskeys } from "../../../hooks/useUserPasskeys";
import { theme } from "../../../styles/color";
import WalletConnectProvider from "../../../providers/WalletConnectProvider";
import "@walletconnect/react-native-compat";

import { useWalletInfo } from '@web3modal/ethers-react-native'

import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  Web3Modal,
} from "@web3modal/ethers-react-native";
import React from "react";

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = "bcf04074fe19f9c2663524759ae56420";

// 2. Create config
const metadata = {
  name: "AppKit RN",
  description: "AppKit RN Example",
  url: "https://walletconnect.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
  },
};

const config = defaultConfig({ metadata });

// 3. Define your chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

const polygon = {
  chainId: 137,
  name: "Polygon",
  currency: "MATIC",
  explorerUrl: "https://polygonscan.com",
  rpcUrl: "https://polygon-rpc.com",
};

const sepholia = {
  chainId: 11155111,
  name: "Sepholia",
  currency: "SPH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://rpc.sepolia.org",
};

const chains = [sepholia ];


createWeb3Modal({
  projectId,
  chains,
  config,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

function SettingsScreen() {
  const logout = useLogout();
  const { register } = usePasskeyRegistration();
  const { passkeys, isLoading } = useUserPasskeys();
  const { open } = useWeb3Modal();
  const { walletInfo } = useWalletInfo()
  

  console.log(walletInfo)
  const hasNoPasskeys = !passkeys?.length && !isLoading;
  const hasPasskeys = !!passkeys?.length;
  return (
    <>
      <WalletConnectProvider>
        <>
          <View
            style={{
              ...styles.container,
              justifyContent: "space-between",
              alignItems: "stretch",
            }}
          >
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

              <Button
                style={styles.button}
                mode="contained-tonal"
                onPress={() => open()}
              >
                Connect wallet
              </Button>
            </View>
            <Separator />
            <Button style={styles.button} mode="outlined" onPress={logout}>
              Log Out
            </Button>
          </View>
          <Web3Modal />
        </>
      </WalletConnectProvider>
    </>
  );
}

const Separator = () => (
  <View
    style={{
      height: 1,
      backgroundColor: theme.colors.primary,
      marginVertical: 16,
      marginHorizontal: 8,
    }}
  />
);

const settingsStyles = StyleSheet.create({
  emptyText: {
    alignSelf: "center",
  },
  sectionHeader: {
    alignSelf: "center",
    fontSize: 18,
    marginBottom: 32,
    color: theme.colors.primary,
  },
  sectionContainer: {
    width: "90%",
    padding: 8,
  },
});

export default SettingsScreen;
