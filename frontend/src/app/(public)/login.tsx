import { useState } from "react";
import { Link, Redirect } from "expo-router";
import { Button, TextInput } from "react-native-paper";
import { View, Image, Text, KeyboardAvoidingView, Platform } from "react-native";
import { useEmailSignIn } from "../../hooks/useEmailSignIn";
import { usePasskeySignIn } from "../../hooks/usePasskeySignIn";
import styles from "../../styles/styles";

export default function LoginScreen() {
    const [email, setEmail] = useState<string>('');

    const { signIn, isPending: isEmailPending, isSuccess, isError } = useEmailSignIn()
    const { signIn: loginWithPasskey, isPending: isPendingPasskey, isSupported } = usePasskeySignIn()

    const isLoading = isEmailPending || isPendingPasskey

    if (isSuccess) {
        return (
            <Redirect href={'/(public)/email-sign-in?email=' + email} />
        )
    }

  return (
    <KeyboardAvoidingView style={styles.containerLogin} behavior={'height'}>
      <View style={styles.item}>
        <Image
          style={styles.image}
          source={require("../../assets/logo.webp")}
        />
        {isSupported && <Button loading={isPendingPasskey} disabled={isLoading} style={{ ...styles.button, marginTop: 40 }} onPress={() => loginWithPasskey()} mode="contained">
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
        {isError && <Text className="text-red-500 mb-4">Wrong email. Check you're using the right email.</Text>}
        <Link testID="sign-up-link" href={'/(public)/signup'}>
          <Text style={styles.linkText}>Don't have an account? Sign Up!</Text>
        </Link>
      </View>
      <Button testID="sign-in-button" loading={isEmailPending} disabled={isLoading} mode="contained" style={styles.button} onPress={() => signIn({ email })}>
        Sign In
      </Button>
    </KeyboardAvoidingView>
  )
}
