import { useContext } from "react";
import { AccountContext } from "../providers/AccountProvider";

export function useAccountContext() {
    const context = useContext(AccountContext)

    return context
}