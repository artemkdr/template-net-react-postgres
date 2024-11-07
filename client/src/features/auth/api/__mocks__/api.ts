// user1/password JWT token, expiration > 2100
export const testValidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InVzZXIxIiwibmFtZWlkIjoidXNlcjEiLCJuYmYiOjE3Mjg2NTA5MzYsImV4cCI6Mjc2NDg2NTA5MzYsImlhdCI6MTcyODY1MDkzNiwiaXNzIjoiJEpXVF9JU1NVRVIiLCJhdWQiOiIkSldUX0FVRElFTkNFIn0.9lNmvx0NivF2Ne59FohjQXTiHohIzVu7Z0gZ_L2Dxio";

export const callApi = async (endpoint: string, options: any = {}) => {
    if (options?.method === "POST") {
        if (endpoint === `login`) {             
            let body : any = {};
            try { body = JSON.parse(options.body); } catch {}            
            if (body.Username === "user1" && body.Password === "password1") {                
                return Promise.resolve({ ok: true, status: 200, json: async () => ({ token: testValidToken })});
            } else if (body.Username?.length > 0 && body.Password?.length > 0) { // non empty username and password
                return Promise.resolve({ ok: false, status: 401 }); 
            } else {                
                return Promise.resolve({ ok: false, status: 400 });
            }
        }
    }
    return Promise.resolve({ status: 200, ok: true, json: async() => ({  }) });
}

export default callApi;