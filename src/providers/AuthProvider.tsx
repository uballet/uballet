import { createContext, PropsWithChildren, useCallback, useState } from "react";
import * as LocalAuthentication from 'expo-local-authentication';

export const AuthContext = createContext<{
    user: {
        email: string;
    } | null,
    loginWithEmailAndPassword: (email: string, password: string) => void,
    loginWithBiometrics: () => Promise<void>,
    logout: () => void
}>({ user: null, loginWithEmailAndPassword: () => {}, loginWithBiometrics: () => Promise.resolve(), logout: () => {} });

export default function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<{ email: string } | null>(null)

    const getBiometricUser = useCallback((): string => {
        return "test@fi.uba.ar"
    }, [])

    const loginWithEmailAndPassword = useCallback((email: string, password: string) => {
        if (email.endsWith('@fi.uba.ar'))
            if (password === 'test')
                setUser({ email })
    }, [])

const loginWithBiometrics = useCallback(async () => {
    try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
            console.log('Device does not support biometric authentication');
            return;
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
            console.log('No biometrics enrolled on this device');
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate with fingerprint',
            fallbackLabel: 'Enter password',
        });

        if (result.success) {
            console.log('Authentication successful');
            const email = getBiometricUser();
            if (email) {
                setUser({ email });
            } else {
                console.log('No biometric user found');
            }
            } else {
            console.log('Authentication failed', result.error || result.warning);
        }
    } catch (error) {
        console.error('Authentication error:', error);
    }
    }, []);

    const logout = useCallback(() => {
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                loginWithEmailAndPassword,
                loginWithBiometrics,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )


}