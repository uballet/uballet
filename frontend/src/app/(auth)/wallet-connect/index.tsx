import { useState, useEffect } from "react";
import { View, Image } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Modal,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import "@walletconnect/react-native-compat";
import styles from "../../../styles/styles";
import { SessionTypes } from "@walletconnect/types";
import { Separator } from "../../../components/Separator/Separator";
import { useWalletConnect } from "../../../hooks/wallet-connect/useWalletConnect";

const SessionCard = (
  session: SessionTypes.Struct,
  deleteSession: (topic: string) => void
) => {
  return (
    <Card
      style={{
        marginVertical: 8,
      }}
      key={session.topic}
    >
      <Card.Title
        title={session.peer.metadata.name}
        subtitle={session.peer.metadata.description}
        right={() => (
          <IconButton
            style={{
              marginRight: 16,
            }}
            icon="close"
            size={16}
            iconColor="black"
            onPress={async () => {
              const topic = session.topic;
              console.log("Disconnecting session: ", topic);
              deleteSession(topic);
            }}
          />
        )}
        left={() => (
          <Image
            style={{
              ...styles.image,
              height: 50,
              width: 50,
              marginHorizontal: 16,
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
  const wcuriScanned = useLocalSearchParams<{ wcuri: string }>()?.wcuri;

  const [wcuri, setWcuri] = useState<string>("");
  const {
    connector,
    activeSessions,
    loading,
    modalData,
    snackbarData,
    approvedCallback,
    rejectedCallback,
    deleteSession,
    pairWcuri,
  } = useWalletConnect();
  const [modalVisible, setModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [modalAmount, setModalAmount] = useState("");

  useEffect(() => {
    setModalVisible(modalData.visible);
  }, [modalData]);

  useEffect(() => {
    setSnackbarVisible(snackbarData.visible);
  }, [snackbarData]);

  useEffect(() => {
    if (wcuriScanned) {
      console.log("Scanned WCURI: ", wcuriScanned);
      try {
        pairWcuri(wcuriScanned);
      } catch (error) {
        // some error happens while pairing - check Expected errors section
      }
    }
  }, [wcuriScanned]);

  const handleWcuriChange = (wcuri: string) => {
    setWcuri(wcuri);
  };

  const handleModalAmountChange = (amount: string) => {
    setModalAmount(amount);
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
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
          <TextInput
            mode="outlined"
            placeholder="Paste WC URI"
            value={wcuri}
            onChangeText={handleWcuriChange}
            keyboardType="default"
          />
          <Button
            mode="contained"
            disabled={!wcuri}
            style={styles.button}
            onPress={() => {
              pairWcuri(wcuri);
              setWcuri("");
            }}
          >
            Add connection via text
          </Button>
          <>
            {activeSessions &&
              Object.values(activeSessions).map((value) =>
                SessionCard(value, deleteSession)
              )}
          </>
          <Modal
            style={{ justifyContent: "center", margin: 16 }}
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
          >
            <View>
              <Card>
                <Card.Title
                  title={modalData.title}
                  subtitle={modalData.subtitle}
                />
                {modalData.askAmount && (
                  <Card.Content>
                    <TextInput
                      mode="outlined"
                      placeholder="Amount"
                      value={modalAmount}
                      onChangeText={handleModalAmountChange}
                      keyboardType="numeric"
                      style={{ marginBottom: 16 }}
                    />
                  </Card.Content>
                )}

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
                    textColor="white"
                    onPress={() => {
                      setModalVisible(false);
                      approvedCallback(modalAmount);
                    }}
                    disabled={modalData.askAmount && !modalAmount}
                  >
                    Approve
                  </Button>
                  <Button
                    style={styles.button}
                    mode="outlined"
                    onPress={() => {
                      setModalVisible(false);
                      rejectedCallback();
                    }}
                  >
                    Reject
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          </Modal>
        </View>
      )}

      <Snackbar
        onDismiss={() => setSnackbarVisible(false)}
        visible={snackbarVisible}
        duration={3000}
      >
        {snackbarData.text}
      </Snackbar>
    </>
  );
};

export default WalletConnectScreen;
