import { useState, useEffect } from "react";
import { Wallet } from "ethers";
import * as SecureStore from "expo-secure-store";
import { View, Image } from "react-native";
import { Button, Card, Modal, Snackbar, Text } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { Core } from "@walletconnect/core";
import "@walletconnect/react-native-compat";
import Client, { Web3Wallet, Web3WalletTypes } from "@walletconnect/web3wallet";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { useSafeLightAccount } from "../../../hooks/useLightAccount";
import styles from "../../../styles/styles";
import { SessionTypes } from "@walletconnect/types";
import { Separator } from "../../../components/Separator/Separator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {
  approveEIP155Request,
  rejectEIP155Request,
} from "./EIP155RequestHandlerUtil";
import { useAuthContext } from "../../../providers/AuthProvider";

const projectId = "bcf04074fe19f9c2663524759ae56420";
const WALLET_CONNECTIONS = "wallet_connections";
// 2. Create config
const metadata = {
  name: "Uballet",
  description: "Uballet dApp using smartcontracts",
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
  console.log("Core initialized");
  await Web3Wallet.init({
    core, // <- pass the shared `core` instance
    metadata: metadata,
  }).then((connector) => {
    console.log("Web3Wallet initialized");
    setConnector(connector);
    return connector;
  }).catch((error) => {
    console.log("Error initializing Web3Wallet: ", error);
  }); 
}


const SessionCard = (session: SessionTypes.Struct) => {
  return (
    <Card key={session.topic}>
      <Card.Title
        title={session.peer.metadata.name}
        subtitle={session.peer.metadata.description}
        right={() => (
          <Image
            style={{
              ...styles.image,
              height: 50,
              width: 50,
              marginRight: 16,
              borderRadius: 8,
            }}
            source={{ uri: session.peer.metadata.icons[0] }}
          />
        )}
      />
      <Card.Content>
        <Text>Chain ID: {Object.values(session.namespaces)[0].chains}</Text>
        <Text>Connected Accounts:</Text>

        <Separator />
        {Object.values(session.namespaces)[0].accounts.map((value, index) => (
          <Text key={index}>Account:{value}</Text>
        ))}
      </Card.Content>
    </Card>
  );
};

const WalletConnectScreen = () => {
  const account = useSafeLightAccount();
  const { user } = useAuthContext();
  const wcuriScanned = useLocalSearchParams<{ wcuri: string }>()?.wcuri;
  const [connector, setConnector] = useState<Client>();
  const [modalVisible, setModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [activeSessions, setActiveSessions] =
    useState<Record<string, SessionTypes.Struct>>();
  const [approvedCallback, setApprovedCallback] = useState(
    () => () => console.log("Initial function")
  );
  const [rejectedCallback, setRejectedCallback] = useState(
    () => () => console.log("Initial function")
  );

  useEffect(() => {
    console.log("Init connector");
    initConnector(setConnector);
  }, []);

  function handleSessionProposal(connector: Client) {
    connector.on(
      "session_proposal",
      async (proposal: Web3WalletTypes.SessionProposal) => {
        try {
          console.log("Session proposal: ", proposal);
          // TODO - refactor `approvedNamespaces` generation
          const approvedNamespaces = buildApprovedNamespaces({
            proposal: proposal.params,
            supportedNamespaces: {
              eip155: {
                chains: ["eip155:11155111"],
                methods: ["eth_sendTransaction", "personal_sign"],
                events: ["accountsChanged", "chainChanged", "message"],
                accounts: [`eip155:11155111:${account.address}`],
              },
            },
          });
          setModalVisible(true);

          setApprovedCallback(() => async () => {
            try {
              const session = await connector.approveSession({
                id: proposal.id,
                namespaces: approvedNamespaces,
              });
              setSnackbarVisible(true);
              await saveSession(connector);
              loadActiveSessions(connector);
              console.log("Session approved: ", session);
            } catch (error) {
              console.log("Error approving session: ", getSdkError(error));
            }
          });

          setRejectedCallback(() => async () => {
            try {
              await connector.rejectSession({
                id: proposal.id,
                reason: getSdkError("USER_REJECTED"),
              });
            } catch (error) {
              console.log("Error rejecting session: ", getSdkError(error));
            }
          });
        } catch (error) {
          console.log("Error approving session: ", getSdkError(error));
        }
      }
    );
  }

  async function saveSession(connector: Client) {
    let activeSessions = connector.getActiveSessions();
    const jsonData = JSON.stringify(activeSessions);
    await AsyncStorage.setItem(WALLET_CONNECTIONS, jsonData);
    loadActiveSessions(connector);
  }

  function handleSessionDelete(connector: Client) {
    connector.on("session_delete", async (session: any) => {
      console.log("Session delete: ", session);
      await saveSession(connector);
    });
  }

  function handleSessionRequest(connector: Client) {
    connector.on(
      "session_request",
      async (requestEvent: Web3WalletTypes.SessionRequest) => {
        console.log("onSessionRequest: ", requestEvent.params.request.method);
        const { params } = requestEvent;
        const { request } = params;

        switch (request.method) {
          case "personal_sign":
          case "eth_sign":
            handlePersionalSign(connector, requestEvent);
          default:
            console.log("onSessionRequest", requestEvent);
        }
      }
    );
  }

  async function handlePersionalSign(
    connector: Client,
    requestEvent: Web3WalletTypes.SessionRequest
  ) {
    const { topic } = requestEvent;
    setModalVisible(true);
    setApprovedCallback(() => async () => {
      try {
        const privateKey = await SecureStore.getItemAsync(
          `signer-${user!!.id}`
        );
        const response = await approveEIP155Request(
          requestEvent,
          new Wallet(privateKey!!),
          account
        );
        console.log("Response: ", response);
        await connector.respondSessionRequest({
          topic,
          response,
        });
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
      }
    });

    setRejectedCallback(() => async () => {
      try {
        let response = rejectEIP155Request(requestEvent);
        await connector.respondSessionRequest({
          topic,
          response,
        });
      } catch (e) {
        console.log((e as Error).message, "error");
        return;
      }
    });
  }

  async function loadActiveSessions(connector: Client) {
    let jsonData = undefined;
    var activeSessions = {};
    if (jsonData) {
      console.log("Active sessions from storage");
      activeSessions = JSON.parse(jsonData);
      setActiveSessions(activeSessions);
    } else {
      console.log("Active sessions from connector");
      activeSessions = connector.getActiveSessions();
      setActiveSessions(activeSessions);
    }
    console.log("Active sessions: ", activeSessions);
  }

  function handlePing(connector: Client) {
    connector.engine.signClient.events.on("session_ping", (data) => {
      console.log("session_ping received", data);
      Toast.show({
        type: "info",
        text1: "Session ping received",
      });
    });
  }

  useEffect(() => {
    if (connector) {
      handleSessionProposal(connector);
      handleSessionDelete(connector);
      handleSessionRequest(connector);
      handlePing(connector);
      loadActiveSessions(connector);
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
      <View style={{ flex: 1, width: "100%", padding: 16 }}>
        <Button
          mode="outlined"
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "scanner",
              params: { screenBack: "wallet-connect" },
            })
          }
        >
          Add connection via QR
        </Button>
        <>
          {activeSessions &&
            Object.values(activeSessions).map((value) => SessionCard(value))}
        </>
        <Modal
          style={{ justifyContent: "center", margin: 16 }}
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
        >
          <View>
            <Card>
              <Card.Title
                title="Confirm you approve the conection"
                subtitle="Be careful with the permissions you approve"
              />

              <Card.Actions
                style={{
                  justifyContent: "space-around",
                  flexDirection: "column",
                  margin: 16,
                }}
              >
                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={() => {
                    setModalVisible(false);
                    approvedCallback();
                  }}
                >
                  <Text>Approve</Text>
                </Button>
                <Button
                  style={styles.button}
                  mode="outlined"
                  onPress={() => {
                    setModalVisible(false);
                    rejectedCallback();
                  }}
                >
                  <Text>Reject</Text>
                </Button>
              </Card.Actions>
            </Card>
          </View>
        </Modal>
      </View>
      <Snackbar
        onDismiss={() => setSnackbarVisible(false)}
        visible={snackbarVisible}
        duration={2000}
      >
        Operation approved
      </Snackbar>
    </>
  );
};

export default WalletConnectScreen;
