import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export function useIsLoggedIn() {
    const { user } = useContext(AuthContext)
    
    return !!user
}