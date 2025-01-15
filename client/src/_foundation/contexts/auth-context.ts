import { createContext, useContext } from 'react';

export interface AuthContextType {
    isLoggedIn: boolean;
    username: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(
            'useAuthContext must be used within an AuthContext.Provider'
        );
    }
    return context;
};
