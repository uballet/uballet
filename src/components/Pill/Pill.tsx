import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PillProps {
    text: string
}
function Pill({ text }: PillProps) {
    return (
        <View style={PillStyles.container}>
            <Text>{text}</Text>
        </View>
    );
}

const PillStyles = StyleSheet.create({
    container: {
        borderRadius: 50,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'purple'
    }
})

export { Pill }