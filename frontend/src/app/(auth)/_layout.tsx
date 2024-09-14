import { Redirect, Slot, Stack, usePathname } from "expo-router";
import { useAuthContext } from "../../providers/AuthProvider";

export default function AuthenticatedLayout() {
  const { user, requiresLocalAuthentication } = useAuthContext();
  const pathname = usePathname();
  const isLockedScreen = pathname.includes("/locked");

  if (!user?.verified) {
    return <Redirect href={"/(public)"} />;
  }

  if (requiresLocalAuthentication && !isLockedScreen) {
    return <Redirect href={"/(auth)/locked"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
