import { Text, View } from "react-native";
import {
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
  Card,
} from "react-native-paper";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSignerStore } from "../../../hooks/useSignerStore";
import * as Clipboard from "expo-clipboard";
import styles from "../../../styles/styles";

export default function RememberScreen() {
  const router = useRouter();
  const [modalText, setModalText] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { loadSeedphrase } = useSignerStore();

  useEffect(() => {
    loadSeedphrase().then((code) => setMnemonic(code!));
  }, []);

  const onOpenModal = () => {
    setModalVisible(true);
    loadSeedphrase().then((code) => setMnemonic(code!));
  };

  useEffect(() => {
    if (!modalVisible) {
      setMnemonic("");
    }
  }, [modalVisible]);

  const onModalDone = () => {
    router.replace("/(auth)/");
  };

  const clipboardButtonHandler = () => {
    Clipboard.setStringAsync(mnemonic);
  };

  return (
    <View
      className="flex-1 items-center justify-center"
      style={styles.container}
    >
      <Card style={styles.genericCard} mode="contained">
        <Card.Title titleVariant="titleMedium" title="Remember your account" />
        <Card.Content>
          <Text style={styles.infoText}>
            You'll need the following code in order to recover your account in
            case of changing/lossing your device
          </Text>
        </Card.Content>
      </Card>

      <Text style={styles.infoText}>COPY AND SAVE SOMEWHERE SAFE!</Text>
      {!mnemonic && <ActivityIndicator />}
      {mnemonic && (
        <View
          testID="mnemonic-text"
          style={{ marginVertical: 16 }}
          className="p-2 border h-64 bg-gray-200 rounded-md"
        >
          <Text className="p-2 text-black">{mnemonic}</Text>
        </View>
      )}
      <Button
        testID="mnemonic-clipboard-button"
        mode="contained-tonal"
        style={styles.button}
        onPress={clipboardButtonHandler}
      >
        <Text style={{ color: "white" }}>Copy to clipboard</Text>
      </Button>
      <Button
        testID="mnemonic-done-button"
        mode="contained"
        style={styles.button}
        onPress={onOpenModal}
      >
        <Text>Done</Text>
      </Button>
      <Modal
        style={{ justifyContent: "center", alignItems: "center" }}
        visible={modalVisible}
        dismissable={modalText === "COPIED"}
        onDismiss={() => setModalVisible(false)}
      >
        <View className="items-center justify-center p-8 rounded-md bg-white border">
          <Text style={styles.infoText}>
            Confirm you're done saving the code
          </Text>
          <Text style={styles.infoText}>Input the word COPIED</Text>
          <TextInput
            testID="mnemonic-done-input"
            mode="outlined"
            style={{ marginVertical: 16, width: "100%" }}
            placeholder="Input the word COPIED"
            value={modalText}
            onChangeText={setModalText}
          />

          <Button
            testID="mnemonic-confirm-done-button"
            mode="contained"
            onPress={onModalDone}
            style={styles.button}
            disabled={modalText !== "COPIED"}
          >
            <Text>Done</Text>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
