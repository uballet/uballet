import { useState } from "react";
import { Link } from "expo-router";
import { Button, TextInput } from "react-native-paper";
import { View, Image, Pressable, Text } from "react-native";
import { useEmailSignIn } from "../../hooks/useEmailSignIn";
import { usePasskeySignIn } from "../../hooks/usePasskeySignIn";
import styles from "../../styles/styles";
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
    const [email, setEmail] = useState<string>('');

    const { signIn, isPending: isEmailPending } = useEmailSignIn()
    const { signIn: loginWithPasskey, isPending: isPendingPasskey } = usePasskeySignIn()

    const isLoading = isEmailPending || isPendingPasskey

  return (
    <View style={styles.containerLogin}>
      <View style={styles.item}>
        <Image
          style={styles.image}
          source={require("../../assets/logo.webp")}
        />
        <Pressable style={styles.button} disabled={isLoading} onPress={() => loginWithPasskey()}>
            <Text style={{ color: 'white' }}>Sign in with passkey</Text>
            <MaterialIcons name="key" size={24} color="white" />
        </Pressable>
        <TextInput
          mode="outlined"
          style={styles.item}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email"
          onChangeText={setEmail}
          autoFocus={true}
        />
      </View>
      <Button mode="contained" style={styles.button} onPress={() => signIn({ email })}>
        Sign In
      </Button>
      <Link href={'/(public)/signup'}>
        <Text>Don't have an account? Sign Up!</Text>
      </Link>
    </View>
  )
}
