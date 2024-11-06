import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

const tokenKey = 'authToken';

interface AuthStore {
	isLoggedIn: boolean,
    isLoading: boolean,
    token: string | null,     
	login: (token: string) => void,
	logout: () => void,
    getUserName: () => string | null,
    getUserId: () => string | null,
    getUserRoles: () => string[] | null,
    hasRole: (role: string) => boolean,
    isAdmin: () => boolean
}

interface JwtPayload {
    unique_name: string,
    nameid: string,
    role: string[],
    aud: string,
    iss: string,
    exp: Number,
    iat: Number,
    nbf: Number
}

export const useAuthStore = create<AuthStore>((set) => ({
	isLoggedIn: false,
    isLoading: false,    
    token: null,        
	login: (token) => {
        set({ isLoggedIn: true, token: token });        
        localStorage.setItem(tokenKey, token);        
    },
	logout: () => {
        set({ isLoggedIn: false, token: null });
        localStorage.removeItem(tokenKey);
    },
    getUserName: () => {
        const token = useAuthStore.getState().token;
        if (token != null) {
            const decodedToken : JwtPayload = jwtDecode(token);
            return decodedToken.unique_name;
        }
        return "Anonymous";
    },
    getUserId: () => {
        const token = useAuthStore.getState().token;
        if (token != null) {
            const decodedToken : JwtPayload = jwtDecode(token);
            return decodedToken.nameid;
        }
        return null;
    },
    getUserRoles: () => {
        const token = useAuthStore.getState().token;
        if (token != null) {
            const decodedToken : JwtPayload = jwtDecode(token);
            return decodedToken.role;
        }
        return null;
    },
    isAdmin: () => {
        const token = useAuthStore.getState().token;
        if (token != null) {
            const decodedToken : JwtPayload = jwtDecode(token);
            return decodedToken.role?.indexOf("admin") >= 0;
        }
        return false;
    },    
    hasRole: (role : string) => {
        const token = useAuthStore.getState().token;
        if (token != null) {
            const decodedToken : JwtPayload = jwtDecode(token);
            return decodedToken.role?.indexOf(role) >= 0;
        }
        return false;
    }
}));

// Initialize store on app load
export const initializeAuthStore = (callApi : Function) => async function() {
    const storedToken = localStorage.getItem(tokenKey);    
    if (storedToken) {
        useAuthStore.getState().login(storedToken);        
        useAuthStore.setState({ isLoading: true });
        try {
            const response = await callApi('touch');                        
            if (response.ok)
                useAuthStore.getState().login(storedToken);
            else
                useAuthStore.getState().logout();
        } catch (err) {
            useAuthStore.getState().logout();
        }
        useAuthStore.setState({ isLoading: false });
    }
};
