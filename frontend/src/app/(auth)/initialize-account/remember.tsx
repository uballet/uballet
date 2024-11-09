import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Modal,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignerStore } from "../../../hooks/useSignerStore";
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


  const onModalDone = () => {
    router.replace("/(auth)/");
  };

  const clipboardButtonHandler = () => {
    Clipboard.setStringAsync(mnemonic);
  };

  if (!mnemonic) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  const mnemonicWords = mnemonic.split(" ");
  const mnemonicThirdWord = mnemonicWords[2];

  return (
    <SafeAreaView className="flex-1 h-full">
      <ScrollView
        className="flex-1 h-full"
        contentContainerStyle={{ padding: 8, justifyContent: "space-between" }}
      >
        <Card style={{margin: 16}} mode="contained">
          <Card.Title
            titleVariant="titleMedium"
            title="Remember your account"
          />
          <Card.Content>
            <Text style={styles.infoText}>
              You'll need the following code in order to recover your account in
              case of changing/lossing your device
            </Text>
          </Card.Content>
        </Card>

        <Text style={styles.infoText}>COPY AND SAVE SOMEWHERE SAFE!</Text>
        <View className="flex-1 justify-between">
          {mnemonicWords.map((word, index) => (
            <View key={index}>
              <View className="flex-row items-center">
                <Text>Word {index + 1}:</Text>
                <Text
                  testID={`mnemonic-word-${index}`}
                  className="flex-1 m-2 p-2 border border-gray-700 bg-gray-200 rounded-md text-black"
                >
                  {word}
                </Text>
              </View>
            </View>
          ))}
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
        </View>
      </ScrollView>

      <Modal
        style={{ justifyContent: "flex-start", alignItems: "center" }}
        visible={modalVisible}
        dismissable={true}
        onDismiss={() => setModalVisible(false)}
      >
        <View className="items-center justify-center p-8 rounded-md bg-white border">
          <Text style={styles.infoText}>
            Confirm you're done saving the code
          </Text>
          <Text style={styles.infoText}>Input the 3rd word of your recovery phrase</Text>
          <TextInput
            testID="mnemonic-done-input"
            mode="outlined"
            style={{ marginVertical: 16, width: "100%" }}
            placeholder="Input the 3rd word of your recovery phrase"
            value={modalText}
            autoFocus={true}
            onChangeText={setModalText}
          />

          <Button
            testID="mnemonic-confirm-done-button"
            mode="contained"
            onPress={onModalDone}
            style={styles.button}
            disabled={modalText !== mnemonicThirdWord}
          >
            <Text>Done</Text>
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
