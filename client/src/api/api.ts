import fetchJson from '@/_foundation/net/fetch-json';
import config from '@/config/config';

export const callApi = async <T>(
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
    return await fetchJson<T>(endpoint, { ...authData, ...options });
};

export default callApi;
