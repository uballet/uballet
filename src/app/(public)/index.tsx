import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthContext } from "../../providers/AuthProvider";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, isEmailSet, loginWithEmailAndPassword, loginWithBiometrics } = useContext(AuthContext);

    useEffect(() => {
        const checkEmailAndLogin = async () => {
            const emailSet = await isEmailSet();
            if (emailSet) {
                loginWithBiometrics();
            }
        };

        checkEmailAndLogin();
    }, [user, isEmailSet, loginWithBiometrics]);

    const handleLogin = () => {
        loginWithEmailAndPassword(email, password);
        loginWithBiometrics();
    };

    return (
        <View style={ScreenStyleSheet.container}>
            <>
                <TextInput
                    style={ScreenStyleSheet.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Email"
                    onChangeText={v => setEmail(v)}
                />
                <TextInput
                    style={ScreenStyleSheet.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Password"
                    onChangeText={v => setPassword(v)}
                    secureTextEntry
                />
                <Pressable
                    style={ScreenStyleSheet.button}
                    onPress={handleLogin}
                >
                    <Text style={ScreenStyleSheet.buttonText}>Login</Text>
                </Pressable>
            </>
        </View>
    );
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
});
