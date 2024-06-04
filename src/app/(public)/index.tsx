import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import useEmailAndPasswordAuth from "../../hooks/useEmailAndPasswordAuth";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const login = useEmailAndPasswordAuth();
    return (
        <View style={ScreenStyleSheet.container}>
            <TextInput style={ScreenStyleSheet.input} autoCapitalize="none" autoCorrect={false} placeholder="Email" onChangeText={v => setEmail(v)}/>
            <TextInput style={ScreenStyleSheet.input} autoCapitalize="none" autoCorrect={false} placeholder="Password" onChangeText={v => setPassword(v)}/>
            <Pressable style={ScreenStyleSheet.button} onPress={() => login(email, password)}>
                <Text style={ScreenStyleSheet.buttonText}>Login</Text>
            </Pressable>
        </View>
    )
}

const ScreenStyleSheet = StyleSheet.create({
    input: {
        marginVertical: 8,
        width: '50%',
        backgroundColor: '#EEEEEE',
        height: 32,
        padding: 4
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        height: '100%'
    },
    button: {
        marginTop: 16,
        borderRadius: 4,
        backgroundColor: 'black',
        padding: 8,
        paddingHorizontal: 24
    },
    buttonText: {
        color: 'white',
    }
})