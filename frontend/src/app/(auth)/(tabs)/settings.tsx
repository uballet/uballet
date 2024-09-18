import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useLogout } from "../../../hooks/useLogout";
import styles from "../../../styles/styles";
import { usePasskeyRegistration } from "../../../hooks/usePasskeyRegistration";
import { useUserPasskeys } from "../../../hooks/useUserPasskeys";
import { theme } from "../../../styles/color";
import WalletConnectProvider from "../../../providers/WalletConnectProvider_test";
import "@walletconnect/react-native-compat";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {
  W3mAccountButton,
  W3mConnectButton,
  W3mNetworkButton,
} from "@web3modal/ethers-react-native";
import { Core } from "@walletconnect/core";
import { Web3Wallet, Web3WalletTypes } from "@walletconnect/web3wallet";
import {
  createWeb3Modal,
  defaultConfig,
  Web3Modal,
} from "@web3modal/ethers-react-native";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeLightAccount } from "../../../hooks/useLightAccount";

const projectId = "bcf04074fe19f9c2663524759ae56420";

// 2. Create config
const metadata = {
  name: "Uballet",
  description: "Uballtt dApp using smartcontracts",
  url: "https://github.com/uballet/uballet",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  redirect: {
    native: "uballet://index",
  },
};

const config = defaultConfig({ metadata });

const sepholia = {
  chainId: 11155111,
  name: "Sepholia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl:
    "https://eth-sepolia.g.alchemy.com/v2/KaOwMyCJOdG7X_ru2JGHt_C-ve5QodPD",
};

const chains = [sepholia];

createWeb3Modal({
  projectId,
  chains,
  config,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

const core = new Core({
  projectId: projectId,
});

async function loadWallet(wcuriScanned: string, address: string) {
  const web3wallet = await Web3Wallet.init({
    core, // <- pass the shared `core` instance
    metadata: metadata,
  });

  async function onSessionProposal({
    id,
    params,
  }: Web3WalletTypes.SessionProposal) {
    try {
      // TODO - refactor `approvedNamespaces` generation
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: ["eip155:11155111"],
            methods: ["eth_sendTransaction", "personal_sign"],
            events: ["accountsChanged", "chainChanged"],
            accounts: [
              `eip155:11155111:${address}`,
            ],
          },
        },
      });
  
      const session = await web3wallet.approveSession({
        id,
        namespaces: approvedNamespaces,
      });
      console.log("Session approved: ", session);
    } catch (error) {
      // use the error.message to show toast/info-box letting the user know that the connection attempt was unsuccessful
      console.log("Error approving session: ", error.message);
      await web3wallet.rejectSession({
        id: proposal.id,
        reason: getSdkError("USER_REJECTED"),
      });
    }
  }

  web3wallet.on("session_proposal", onSessionProposal);

  // Call this after WCURI is received
  const wcuri = wcuriScanned;
  await web3wallet.pair({ uri: wcuri });
  //           let session = await web3wallet.pair({ wcuri });
  // console.log("Session created: ", session);
}

function SettingsScreen() {
  const logout = useLogout();
  const account = useSafeLightAccount();

  const { register } = usePasskeyRegistration();
  const { passkeys, isLoading } = useUserPasskeys();
  const wcuriScanned = useLocalSearchParams<{ wcuri: string }>()?.wcuri;

  const hasNoPasskeys = !passkeys?.length && !isLoading;
  const hasPasskeys = !!passkeys?.length;

  useEffect(() => {
    if (wcuriScanned) {
      console.log("Scanned WCURI: ", wcuriScanned);
      try {
        loadWallet(wcuriScanned, account.address);
      } catch (error) {
        // some error happens while pairing - check Expected errors section
      }
    }
  }, [wcuriScanned]);

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
            <W3mAccountButton />
            <W3mConnectButton label={""} loadingLabel={""} />
            <W3mNetworkButton />
            <Button
              mode="outlined"
              style={styles.button}
              onPress={() => router.push({ pathname: "scanner" })}
            >
              Scann dApp QR
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
