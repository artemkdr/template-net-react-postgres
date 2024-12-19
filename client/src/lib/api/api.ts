import config from '@/config/config';

export const callApi = async (
    endpoint: string,
    options: object = {},
    authToken: string | null = null
) => {
    const token = authToken;
    if (endpoint != null && !endpoint.startsWith('http')) {
        endpoint = `${config.API_URL}/${endpoint}`;
    }
    const authData: object = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
    const data: object = { ...authData, ...options };
    try {
        const response = await fetch(endpoint, data);
        if (response.ok) {
            return response;
        }
        if (response.status === 401) {
            // Unauthorized (token likely expired)
            // Optionally, redirect to login or handle token refresh here
        }
        return response;
    } catch (error: unknown) {
        const msg =
            typeof error === 'object' && error !== null && 'message' in error
                ? error.message
                : (error as string);
        return {
            status: 501,
            message: msg,
            error: error,
            ok: false,
            json: () => {
                return JSON.parse('{}');
            },
        };
    }
};

export default callApi;
