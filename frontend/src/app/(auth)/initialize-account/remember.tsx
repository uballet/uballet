import { Text, View } from "react-native";
import { Modal, TextInput } from "react-native-paper";
import { Button } from "../../../components/Button";
import { useEffect, useState } from "react";
import { useAccountContext } from "../../../hooks/useAccountContext";
import { useRouter } from "expo-router";

export default function RememberScreen() {
    const router = useRouter()
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');
    const { mnemonic, clearMnemonic } = useAccountContext();

    useEffect(() => {
        return () => {
            clearMnemonic()
        }
    }, [])

    const onModalDone = () => {
        router.replace('/(auth)/')
    }
    
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ margin: 8 }}>You'll need the following code in order to recover your account in case of changing/lossing your device</Text>
            <Text style={{ margin: 8 }}>COPY AND SAVE SOMEWHERE SAFE!</Text>
            <View style={{ margin: 8, borderWidth: 1, padding: 8, height: 400, backgroundColor: '#EEEEEE' }}>
                <Text style={{ padding: 8, color: 'black' }}>
                    {mnemonic}
                </Text>
            </View>
            <Button onPress={() => setModalVisible(true)}>
                <Text>Done</Text>
            </Button>
            <Modal
                style={{ justifyContent: "center", alignItems: "center" }}
                visible={modalVisible}
            >
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 32, borderRadius: 8, borderWidth: 1, borderColor: 'blue', backgroundColor: 'white',  }}>
                    <Text>Confirm you're done saving the code</Text>
                    <Text>Input the word COPIED</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Input the word COPIED"
                        style={{ margin: 8, width: '90%' }}
                        value={modalText}
                        onChangeText={setModalText}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            onPress={onModalDone} disabled={modalText !== 'COPIED'}
                            >
                            <Text>Done</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    )
}