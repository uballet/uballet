import { useEffect, useState } from "react";
import { Link, Redirect, router } from "expo-router";
import { Button, TextInput } from "react-native-paper";
import { View, Image, Pressable, Text, KeyboardAvoidingView } from "react-native";
import { useEmailSignIn } from "../../hooks/useEmailSignIn";
import { usePasskeySignIn } from "../../hooks/usePasskeySignIn";
import styles from "../../styles/styles";

export default function LoginScreen() {
    const [email, setEmail] = useState<string>('');

    const { signIn, isPending: isEmailPending, isSuccess } = useEmailSignIn()
    const { signIn: loginWithPasskey, isPending: isPendingPasskey, isSupported } = usePasskeySignIn()

    const isLoading = isEmailPending || isPendingPasskey

    if (isSuccess) {
        return (
            <Redirect href={'/(public)/email-sign-in?email=' + email} />
        )
    }

  return (
    <KeyboardAvoidingView style={styles.containerLogin}>
      <View style={styles.item}>
        <Image
          style={styles.image}
          source={require("../../assets/logo.webp")}
        />
        {isSupported && <Button loading={isPendingPasskey} disabled={isLoading} style={{ ...styles.button, marginTop: 64 }} onPress={() => loginWithPasskey()} mode="contained">
            <Text>Sign in with passkey</Text>
        </Button>}
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
        <Link href={'/(public)/signup'}>
          <Text>Don't have an account? Sign Up!</Text>
        </Link>
      </View>
      <Button loading={isEmailPending} disabled={isLoading} mode="contained" style={styles.button} onPress={() => signIn({ email })}>
        Sign In
      </Button>
    </KeyboardAvoidingView>
  )
}
