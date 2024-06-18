import React from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLogout } from '../../../hooks/useLogout';

function SettingsScreen() {
    const logout = useLogout();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Log Out</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'black',
        width: '50%',
        padding: 8,
        alignItems: 'center',
        borderRadius: 8
    },
    buttonText: {
        color: 'white',
    }
})

export default SettingsScreen
