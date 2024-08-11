import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export function useLogout() {
    const { logout } = useContext(AuthContext)

    return logout
}