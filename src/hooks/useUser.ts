import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export default function useUser() {
    const { user } = useContext(AuthContext)
    return user
}