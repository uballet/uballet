import { useEffect, useState } from "react";
import { Link, Redirect, router } from "expo-router";
import { Button, TextInput } from "react-native-paper";
import { View, Image, Pressable, Text } from "react-native";
import { useEmailSignIn } from "../../hooks/useEmailSignIn";
import { usePasskeySignIn } from "../../hooks/usePasskeySignIn";
import styles from "../../styles/styles";

export default function LoginScreen() {
    const [email, setEmail] = useState<string>('fpondarts@gmail.com');

    const { signIn, isPending: isEmailPending, isSuccess } = useEmailSignIn()
    const { signIn: loginWithPasskey, isPending: isPendingPasskey } = usePasskeySignIn()

    const isLoading = isEmailPending || isPendingPasskey

    if (isSuccess) {
        return (
            <Redirect href={'/(public)/email-sign-in?email=' + email} />
        )
    }

  return (
    <View style={styles.containerLogin}>
      <View style={styles.item}>
        <Image
          style={styles.image}
          source={require("../../assets/logo.webp")}
        />
        <Button style={{ ...styles.button, marginTop: 64 }} onPress={() => loginWithPasskey()} mode="contained">
            <Text>Sign in with passkey</Text>
        </Button>
        <TextInput
          mode="outlined"
          style={styles.item}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email"
          value={email}
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
