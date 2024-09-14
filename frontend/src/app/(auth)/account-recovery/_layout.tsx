import { Redirect, Slot } from "expo-router";
import { useAccountContext } from "../../../hooks/useAccountContext";

export default function AccountRecoveryLayout() {
    const { needsRecovery } = useAccountContext();

    if (!needsRecovery) {
        return <Redirect href="/(auth)/" />
    }
    return <Slot />
}