import { ScrollView, Text, View } from "react-native";
import { ActivityIndicator, Modal, TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSignerStore } from "../../../hooks/useSignerStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RememberScreen() {
    const router = useRouter()
    const [modalText, setModalText] = useState('')
    const [mnemonic, setMnemonic] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const { loadSeedphrase } = useSignerStore();

    useEffect(() => {
        loadSeedphrase().then(code => setMnemonic(code!))
    }, [])

    const onOpenModal = () => {
        setModalVisible(true)
        loadSeedphrase().then(code => setMnemonic(code!))
    }

    const onModalDone = () => {
        router.replace('/(auth)/')
    }

    if (!mnemonic) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        )
    }
    
    const mnemonicWords = mnemonic.split(' ');
    
    return (
        <SafeAreaView className="flex-1 h-full">
            <ScrollView className="flex-1 h-full" contentContainerStyle={{ padding: 8, justifyContent: 'space-between' }}>
                <View className="flex-1 justify-between">
                    <View className="self-center items-center">
                        <Text className="m-2">
                            You'll need the following code in order to recover your account in case of changing/lossing your device
                        </Text>
                        <Text className="m-2">
                            COPY AND SAVE SOMEWHERE SAFE!
                        </Text>
                    </View>
                    {mnemonicWords.map((word, index) => (
                        <View key={index} >
                            <View className="flex-row items-center">
                                <Text>Word {index + 1}:</Text>
                                <Text testID={`mnemonic-word-${index}`} className="flex-1 m-2 p-2 border border-gray-700 bg-gray-200 rounded-md text-black">
                                    {word}
                                </Text>
                            </View>
                        </View>
                    ))}
                    <Button className="mt-4" testID="mnemonic-done-button" mode="contained" onPress={onOpenModal}>
                        <Text>Done</Text>
                    </Button>
                </View>
            </ScrollView>
            <Modal
                style={{ justifyContent: "center", alignItems: "center" }}
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
            >
                <View className="items-center justify-center p-8 rounded-md bg-white border">
                    <Text>Confirm you're done saving the code</Text>
                    <Text>Input the 3rd word of your recovery phrase</Text>
                    <TextInput
                        testID="mnemonic-done-input"
                        mode="outlined"
                        autoCapitalize="none"
                        placeholder="Input the word COPIED"
                        className="m-2 w-[90%]"
                        value={modalText}
                        onChangeText={setModalText}
                    />
                    <View className="flex-row">
                        <Button testID="mnemonic-confirm-done-button" mode="contained" onPress={onModalDone} disabled={modalText !== mnemonicWords[2]}>
                            <Text>Done</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}