import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import uballet, { getUballetToken, removeUballetToken } from "../api/uballet";
import { ActivityIndicator, View } from "react-native";

type User = {
    id: string;
    email: string;
    verified: boolean;
}
export const AuthContext = createContext<{
    user: User | null,
    setUser: (user: User | null) => void,
    logout: () => void,
    passkeysOnboarded: boolean,
    skipPasskeys: () => void
}>({
    user: null,
    setUser: () => {},
    logout: () => {},
    passkeysOnboarded: false,
    skipPasskeys: () => {},
})

export default function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null)
    const [passkeysOnboarded, setPasskeysOnboarded] = useState(false)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        async function initAuth() {
            const token = await getUballetToken()
            try {
                if (token) {
                    console.log('GETTING TOKEN')
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
                skipPasskeys
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
