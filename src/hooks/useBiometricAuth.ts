import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export default function useBiometricAuth() {
    const { loginWithBiometrics } = useContext(AuthContext)
    return loginWithBiometrics
}