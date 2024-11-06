import { createContext, useContext } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    userName: string | null;
    login: (token : string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>({
    isLoggedIn: false,
    userName: null,
    login: () => {},
    logout: () => {},
});

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthContext.Provider");
    }
    return context;
};  