import { View } from "react-native";
import { Button } from "react-native-paper";
import { useLogout } from "../../../hooks/useLogout";
import styles from "../../../styles/styles";

function SettingsScreen() {
  const logout = useLogout();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button style={styles.button} onPress={logout}>
        Log Out
      </Button>
    </View>
  );
}

export default SettingsScreen;
