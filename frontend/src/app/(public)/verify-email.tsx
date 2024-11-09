import { Redirect } from "expo-router";
import { Text, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAuthContext } from "../../providers/AuthProvider";
import { useState } from "react";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";
import styles from "../../styles/styles";

export default function VerifyEmailScreen() {
  const { user } = useAuthContext();
  const [code, setCode] = useState<string>("");
  const { verifyEmail, isPending, isSuccess, isError } = useVerifyEmail();
  const isLoading = isPending || isSuccess;
  const disabled = isLoading || !code;

  if (!user) {
    return <Redirect href={"/(public)"} />;
  }

  return (
    <KeyboardAvoidingView
      style={{ ...styles.containerLogin, justifyContent: "center" }}
      behavior={"height"}
    >
      <View style={{ padding: 16 }}>
        <Text style={styles.infoText}>Verify your email: {user.email}</Text>
        <TextInput
          testID="sign-up-code-input"
          value={code}
          mode="outlined"
          style={{ marginVertical: 16 }}
          onChangeText={setCode}
          textContentType="oneTimeCode"
          keyboardType="number-pad"
          placeholder="Enter verification code"
          selectTextOnFocus={false}
          editable={!isPending}
        />
        {isError && (
          <Text className="text-red-500 mt-2">
            Invalid code. Check your email.
          </Text>
        )}
        <Button
          testID="verify-email-button"
          mode="contained"
          style={styles.button}
          disabled={disabled}
          loading={isLoading}
          onPress={() => verifyEmail({ code })}
        >
          <Text>Submit Code</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
