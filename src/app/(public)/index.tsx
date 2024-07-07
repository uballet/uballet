import { useContext, useEffect, useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { View, Image } from "react-native";
import { AuthContext } from "../../providers/AuthProvider";
import styles from "../../styles/styles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, isEmailSet, loginWithEmailAndPassword, loginWithBiometrics } =
    useContext(AuthContext);

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
          onSubmitEditing={() => {
            this.secondTextInput.focus();
          }}
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
          secureTextEntry={true}
          ref={(input) => {
            this.secondTextInput = input;
          }}
          onChangeText={(v) => setPassword(v)}
        />
      </View>
      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>
    </View>
  );
}
