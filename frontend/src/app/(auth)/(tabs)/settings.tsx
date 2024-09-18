import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { Core } from "@walletconnect/core";
import "@walletconnect/react-native-compat";
import Client, { Web3Wallet, Web3WalletTypes } from "@walletconnect/web3wallet";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { useLogout } from "../../../hooks/useLogout";
import { usePasskeyRegistration } from "../../../hooks/usePasskeyRegistration";
import { useUserPasskeys } from "../../../hooks/useUserPasskeys";
import { useSafeLightAccount } from "../../../hooks/useLightAccount";
import styles from "../../../styles/styles";
import { theme } from "../../../styles/color";

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

async function initConnector(setConnector: any) {
  const core = new Core({
    projectId: projectId,
  });

  const web3wallet = await Web3Wallet.init({
    core, // <- pass the shared `core` instance
    metadata: metadata,
  });
  setConnector(web3wallet);
}

function SettingsScreen() {
  const logout = useLogout();
  const account = useSafeLightAccount();
  const [connector, setConnector] = useState<Client>();

  const { register } = usePasskeyRegistration();
  const { passkeys, isLoading } = useUserPasskeys();
  const wcuriScanned = useLocalSearchParams<{ wcuri: string }>()?.wcuri;

  const hasNoPasskeys = !passkeys?.length && !isLoading;
  const hasPasskeys = !!passkeys?.length;

  useEffect(() => {
    console.log("Init connector");
    initConnector(setConnector);
  }, []);

  useEffect(() => {
    if (connector) {
      connector?.on("session_proposal", async (proposal: Web3WalletTypes.SessionProposal) => {
        try {
          console.log("Session proposal: ", proposal);
          // TODO - refactor `approvedNamespaces` generation
          const approvedNamespaces = buildApprovedNamespaces({
            proposal: proposal.params,
            supportedNamespaces: {
              eip155: {
                chains: ["eip155:11155111"],
                methods: ["eth_sendTransaction", "personal_sign"],
                events: ["accountsChanged", "chainChanged"],
                accounts: [`eip155:11155111:${account.address}`],
              },
            },
          });
  
          const session = await connector.approveSession({
            id: proposal.id,
            namespaces: approvedNamespaces,
          });
          console.log("Session approved: ", session);
        }catch (error) {
          console.log("Error approving session: ", getSdkError(error));
        }
       
      });
    }
  }, [connector]);

  useEffect(() => {
    if (wcuriScanned) {
      console.log("Scanned WCURI: ", wcuriScanned);
      try {
        connector?.pair({ uri: wcuriScanned });
      } catch (error) {
        // some error happens while pairing - check Expected errors section
      }
    }
  }, [wcuriScanned]);

  return (
    <>
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

            <Button
              mode="outlined"
              style={styles.button}
              onPress={() => router.push({ pathname: "scanner" })}
            >
              Scann dApp QR
            </Button>
          </View>
        </>
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
