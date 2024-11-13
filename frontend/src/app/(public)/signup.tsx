import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useSignUp } from "../../hooks/useSignUp";
import styles from "../../styles/styles";

export default function SignUpScreen() {
  const { signup, isPending, isError, error } = useSignUp();
  const [email, setEmail] = useState<string>("");

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Invalid email / Already signed up";

  const handleSignUp = async () => {
    try {
      await signup({ email });
    } catch (err) {
      // Error is already handled by the mutation
      // and displayed through the error state
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ ...styles.containerLogin, justifyContent: "center" }}
      behavior={"height"}
    >
      <View style={styles.item}>
        <TextInput
          testID="sign-up-email-input"
          mode="outlined"
          style={styles.button}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoFocus={true}
        />
        {isError && <Text className="text-red-500 mb-4">{errorMessage}</Text>}
        <Button
          testID="sign-up-button"
          mode="contained"
          style={styles.button}
          disabled={isPending}
          onPress={handleSignUp}
        >
          <Text className="text-white">Sign up</Text>
        </Button>
        <Link href={"/(public)/login"}>
          <Text testID="already-signed-up-link" style={styles.linkText}>
            Already have an account? Sign In!
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
