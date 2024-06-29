import { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import useEmailAndPasswordAuth from "../../hooks/useEmailAndPasswordAuth";
import { View, Image } from "react-native";
import styles from "../../styles/styles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useEmailAndPasswordAuth();
  return (
    <View style={styles.containerLogin}>
      <View style={styles.item}>
        <Image
          style={styles.image}
          source={require("../../assets/logo.webp")}
        />
        <TextInput
          mode="outlined"
          style={styles.item}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email"
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          onChangeText={(v) => setEmail(v)}
          autoFocus={true}
        />
        <TextInput
          mode="outlined"
          style={styles.item}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="visible-password"
          placeholder="Password"
          ref={(input) => { this.secondTextInput = input; }}
          onChangeText={(v) => setPassword(v)}
        />
      </View>
      <Button mode="contained-tonal" onPress={() => login(email, password)}>
        Login
      </Button>
    </View>
  );
}
