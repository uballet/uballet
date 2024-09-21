import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { router } from "expo-router";
import { useLogout } from "../../../hooks/useLogout";
import { usePasskeyRegistration } from "../../../hooks/usePasskeyRegistration";
import { useUserPasskeys } from "../../../hooks/useUserPasskeys";
import styles from "../../../styles/styles";
import { theme } from "../../../styles/color";
import { Separator } from "../../../components/Separator/Separator";

function SettingsScreen() {
  const logout = useLogout();

  const { register } = usePasskeyRegistration();
  const { passkeys, isLoading } = useUserPasskeys();

  const hasNoPasskeys = !passkeys?.length && !isLoading;
  const hasPasskeys = !!passkeys?.length;

  return (
    <>
      <View
        style={{
          ...styles.container,
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        <View style={{ flex: 1 }}>
          <Card>
            <Card.Content>
              <Text variant="titleMedium" style={styles.item}>
                Passkeys
              </Text>
              {hasNoPasskeys && (
                <Text style={settingsStyles.emptyText}>
                  You don't have any passkeys
                </Text>
              )}
              {hasPasskeys &&
                passkeys?.map((passkey) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{passkey.name.slice(0, 16) + "..."}</Text>
                    <Text>
                      {"Registered At: " +
                        passkey.registeredAt.toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              {isLoading && <ActivityIndicator />}
              <Button
                style={styles.button}
                mode="contained"
                onPress={() => register()}
                disabled={isLoading}
              >
                Register New Passkey
              </Button>
            </Card.Content>
          </Card>
        </View>
        <Separator />
        <Button style={styles.button} mode="outlined" onPress={logout}>
          Log Out
        </Button>

        <Button
          mode="outlined"
          style={styles.button}
          onPress={() => router.push({ pathname: "wallet-connect" })}
        >
          Connections
        </Button>
      </View>
    </>
  );
}

const settingsStyles = StyleSheet.create({
  emptyText: {
    alignSelf: "center",
  },
  sectionHeader: {
    alignSelf: "center",
    fontSize: 18,
    marginBottom: 32,
    color: theme.colors.primary,
  },
  sectionContainer: {
    width: "90%",
    padding: 8,
  },
});

export default SettingsScreen;
