import { ScrollView, View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import ContactList from "../../../components/ContactList/ContactList";
import { useContacts } from '../../../hooks/contacts/useContacts';
import { useENS } from "../../../hooks/useENS";
import { Separator } from "../../../components/Separator/Separator";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "../../../styles/styles";

function TransferScreen() {
  const { contacts, isLoading } = useContacts();
  const { resolveName } = useENS();
  const router = useRouter();

  const handleNewPress = () => {
    router.push("/transfer/input-address");
  };

  return (
    <ScrollView>

      {/* Send to new address button */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <TouchableOpacity
          testID="new-address-button"
          onPress={handleNewPress}
          style={{
            backgroundColor: "#007bff",
            borderRadius: 50,
            padding: 20,
            width: 100,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <MaterialIcons name="add" size={40} color="#fff" />
          <Text style={{ color: "#fff", marginTop: 4 }}>New</Text>
        </TouchableOpacity>
      </View>

      <Separator />

      <Text style={ styles.infoText }>Send to your contacts</Text>

      <ContactList
        contacts={contacts ?? []}
        resolveName={resolveName}
        isPending={false}
        enableDelete={ false }/>
    </ScrollView>
  );
}

export default TransferScreen;
