import { useCallback, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export default function useEmailAndPasswordAuth() {
    const { loginWithEmailAndPassword } = useContext(AuthContext)
    return loginWithEmailAndPassword
}