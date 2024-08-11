import { Slot } from "expo-router";
import { SafeAreaView } from "react-native";

function ContactsLayout() {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Slot />
        </SafeAreaView>
    );
}

export default ContactsLayout
