import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import uballet, { getUballetToken, removeUballetToken } from "../api/uballet";
import { ActivityIndicator, AppState, View } from "react-native";
import * as LocalAuthentication from 'expo-local-authentication';
import { type User } from "../api/uballet/types";
import { isDevice } from "expo-device";
import { useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext<{
    user: User | null,
    setUser: (user: User | null) => void,
    logout: () => void,
    passkeysOnboarded: boolean,
    requiresLocalAuthentication: boolean,
    skipPasskeys: () => void,
    requestAuthentication: () => Promise<void>,
    temporarilyDisableAuth: () => void
}>({
    user: null,
    setUser: () => {},
    logout: () => {},
    passkeysOnboarded: false,
    requiresLocalAuthentication: false,
    skipPasskeys: () => {},
    requestAuthentication: async () => {},
    temporarilyDisableAuth: () => {},
})

let temporarilyMovedToBackground = false

export default function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null)
    const [requiresLocalAuthentication, setRequiresLocalAuthentication] = useState(false)
    const [passkeysOnboarded, setPasskeysOnboarded] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const appState = useRef(AppState.currentState.valueOf())
    const queryClient = useQueryClient();

    const requestAuthentication = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync()
        if (hasHardware) {
            const isEnrolled = await LocalAuthentication.isEnrolledAsync()
            if (isEnrolled) {
                temporarilyMovedToBackground = true
                LocalAuthentication.authenticateAsync().then((result) => {
                    if (result.success) {
                        setTimeout(() => {
                            temporarilyMovedToBackground = false
                            setRequiresLocalAuthentication(false)
                        }, 1000)
                    } else {
                        temporarilyMovedToBackground = false
                    }
                })
            }
        }
    }

    useEffect(() => {
        if (user && isDevice) {
            const handleAppStateChange = (nextAppState: string) => {
                console.log({ current: appState.current, next: nextAppState, requiresLocalAuthentication })
                const shouldAuthenticate = nextAppState === 'active' && appState.current.match(/inactive|background/) && !temporarilyMovedToBackground
                if (shouldAuthenticate) {
                    requestAuthentication();
                } else {
                    setRequiresLocalAuthentication(true)
                }
                appState.current = nextAppState;
            
            }
            const subscription = AppState.addEventListener('change', handleAppStateChange)

            return () => subscription.remove()
        }
    }, [user])

    useEffect(() => {
        async function initAuth() {
            const token = await getUballetToken()
            try {
                if (token) {
                    const user = await uballet.getCurrentUser()
                    setUser(user)
                }
            } catch (error) {
                
            } finally {
                setIsReady(true)
            }
        }
        initAuth()
    }, [])

    const skipPasskeys = useCallback(() => {
        setPasskeysOnboarded(true)
    }, [])

    const logout = useCallback(async () => {
        await removeUballetToken().then(() => {
            setUser(null)
        })
    }, [])

    useEffect(() => {
        if (!user) {
            setPasskeysOnboarded(false)
        }
    }, [user])

    useEffect(() => {
        if (!user) {
            queryClient.clear()
        }
    }, [user])

    const temporarilyDisableAuth = useCallback(() => {
        temporarilyMovedToBackground = true;
        setTimeout(() => {
            temporarilyMovedToBackground = false;
            setRequiresLocalAuthentication(false);
        }, 1000);
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                passkeysOnboarded,
                skipPasskeys,
                requiresLocalAuthentication,
                requestAuthentication,
                temporarilyDisableAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)

    return context
}
