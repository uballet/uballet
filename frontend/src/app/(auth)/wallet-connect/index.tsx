import { useState, useEffect } from "react";
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

  function handleSendTrasnaction(connector: Client) {
    connector.on("eth_sendTransaction", async (transaction: any) => {
      console.log("Transaction: ", transaction);
    });
  }

  function handlePersionalSign(connector: Client) {
    connector.on("personal_sign", async (sign: any) => {
      console.log("Personal sign: ", sign);
    });
  }

  function loadActiveSessions(connector: Client) {
    const activeSessions = connector.getActiveSessions();
    setActiveSessions(activeSessions);
    console.log("Active sessions: ", activeSessions);
  }

  useEffect(() => {
    if (connector) {
      handleSessionProposal(connector);
      handleSendTrasnaction(connector);
      handlePersionalSign(connector);
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
        onDismiss={() => console.log("Dismissed snackbar")}
        visible={snackbarVisible}
        duration={2000}
      >
        Operation approved
      </Snackbar>
    </>
  );
};

export default WalletConnectScreen;
