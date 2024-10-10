import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import config from '../config';
import callApi from '../net/api';


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
	login: (token, id = '') => {
        set({ isLoggedIn: true, token: token });        
        localStorage.setItem(config.TOKEN_KEY, token);        
    },
	logout: () => {
        set({ isLoggedIn: false, token: null });
        localStorage.removeItem(config.TOKEN_KEY);
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
(async function initializeAuthStore() {
    const storedToken = localStorage.getItem(config.TOKEN_KEY);    
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
  })();
