import { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext<{
    user: { email: string } | null,
    isEmailSet: () => Promise<boolean>,
    loginWithEmailAndPassword: (email: string, password: string) => void,
    loginWithBiometrics: () => Promise<void>,
    logout: () => void
}>({ 
    user: null, 
    isEmailSet: async () => false, 
    loginWithEmailAndPassword: () => {}, 
    loginWithBiometrics: () => Promise.resolve(), 
    logout: () => {} 
});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

    const checkBiometricAvailability = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricAvailable(hasHardware && isEnrolled);
    };

    useEffect(() => {
        //checkBiometricAvailability();
        const loadStoredCredentials = async () => {
            const email = await SecureStore.getItemAsync('userEmail');
    
            console.log('Stored email:', email);
            setUser({ email } );
        };
        loadStoredCredentials();
    }, []);

    const storeUserCredentials = async (email: string) => {
        await SecureStore.setItemAsync('userEmail', email);
    };

    const clearUserCredentials = async () => {
        await SecureStore.deleteItemAsync('userEmail');
    };

    const isEmailSet = async () => {
        const email = await SecureStore.getItemAsync('userEmail');
        return email != null;
    };

    const loginWithEmailAndPassword = useCallback(async (email: string, password: string) => {
        if (email.endsWith('@fi.uba.ar') && password === 'test') {
            await storeUserCredentials(email);
        }
    }, []);

    const loginWithBiometrics = useCallback(async () => {
        if (!isBiometricAvailable) {
            console.log('Biometric authentication is not available');
            return;
        }

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate with fingerprint',
                fallbackLabel: 'Enter password',
            });

            if (result.success) {
                console.log('Authentication successful');
                const email = await SecureStore.getItemAsync('userEmail');
                if (email) {
                    setUser({ email });
                } else {
                    console.log('No stored user credentials found');
                }
            } else {
                console.log('Authentication failed', result.error || result.warning);
            }
        } catch (error) {
            console.error('Authentication error:', error);
        }
    }, [isBiometricAvailable]);

    const logout = useCallback(async () => {
        setUser(null);
        await clearUserCredentials();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isEmailSet,
                loginWithEmailAndPassword,
                loginWithBiometrics,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
