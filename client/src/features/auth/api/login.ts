import callApi from "@/features/auth/api/api"

export const login = async (username : string, password: string) => callApi("login", { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Username: username, Password: password }) 
});
