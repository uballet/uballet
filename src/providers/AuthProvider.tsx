import { createContext, PropsWithChildren, useCallback, useState } from "react";

export const AuthContext = createContext<{
    user: {
        email: string;
    } | null,
    loginWithEmailAndPassword: (email: string, password: string) => void,
    logout: () => void
}>({ user: null, loginWithEmailAndPassword: () => {}, logout: () => {} })

export default function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<{ email: string } | null>(null)
    const loginWithEmailAndPassword = useCallback((email: string, password: string) => {
        if (email.endsWith('@fi.uba.ar'))
            if (password === 'test')
                setUser({ email })
    }, [])

    const logout = useCallback(() => {
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                loginWithEmailAndPassword,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )


}