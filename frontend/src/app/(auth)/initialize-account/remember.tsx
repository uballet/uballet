import { Text, View } from "react-native";
import { ActivityIndicator, Modal, TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { useAccountContext } from "../../../hooks/useAccountContext";
import { useRouter } from "expo-router";
import { useSignerStore } from "../../../hooks/useSignerStore";

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

    useEffect(() => {
        if (!modalVisible) {
            setMnemonic('')
        }
    }, [modalVisible])

    const onModalDone = () => {
        router.replace('/(auth)/')
    }
    
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="m-2">
                You'll need the following code in order to recover your account in case of changing/lossing your device
            </Text>
            <Text className="m-2">
                COPY AND SAVE SOMEWHERE SAFE!
            </Text>
            {!mnemonic && (
                <ActivityIndicator />
            )}
            {mnemonic && (
                <View testID="mnemonic-text" className="m-2 p-2 border h-64 bg-gray-200 rounded-md">
                    <Text className="p-2 text-black">
                        {mnemonic}
                    </Text>
                </View>
            )}
            <Button testID="mnemonic-done-button" mode="contained" onPress={onOpenModal}>
                <Text>Done</Text>
            </Button>
            <Modal
                style={{ justifyContent: "center", alignItems: "center" }}
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
            >
                <View className="items-center justify-center p-8 rounded-md bg-white border">
                    <Text>Confirm you're done saving the code</Text>
                    <Text>Input the word COPIED</Text>
                    <TextInput
                        testID="mnemonic-done-input"
                        mode="outlined"
                        placeholder="Input the word COPIED"
                        className="m-2 w-[90%]"
                        value={modalText}
                        onChangeText={setModalText}
                    />
                    <View className="flex-row">
                        <Button testID="mnemonic-confirm-done-button" mode="contained" onPress={onModalDone} disabled={modalText !== 'COPIED'}>
                            <Text>Done</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    )
}