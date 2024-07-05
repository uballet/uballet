import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react";

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

    const skipPasskeys = useCallback(() => {
        setPasskeysOnboarded(true)
    }, [])

    const logout = useCallback(() => {
        setUser(null)
    }, [])

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