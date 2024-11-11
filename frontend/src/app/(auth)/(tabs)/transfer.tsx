import { ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import ContactList from "../../../components/ContactList/ContactList";
import { useContacts } from "../../../hooks/contacts/useContacts";
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
      <View style={styles.containerTransfer}>
        <Card style={{ ...styles.genericCard, marginBottom: 4 }}>
          <Card.Title titleVariant="titleMedium" title="Send to an address" />
          <Card.Content>
            <Button
              mode="contained"
              testID="new-address-button"
              style={styles.button}
              onPress={handleNewPress}
              icon={({ size, color }) => (
                <MaterialIcons name="add" size={30} color="#fff" />
              )}
            >
              <Text className="text-white text-center font-bold">
                New address
              </Text>
            </Button>
          </Card.Content>
        </Card>
        <View
          style={{
            width: "100%",
          }}
        >
          <Separator />
        </View>

        {/* Send to contacts */}
        <Card style={{ ...styles.genericCard, margin: 4 }}>
          <Card.Title
            titleVariant="titleMedium"
            title="Send to your contacts"
          />
          <Card.Content>
            <ContactList
              contacts={contacts ?? []}
              resolveName={resolveName}
              isPending={false}
              enableDelete={false}
            />
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

export default TransferScreen;
