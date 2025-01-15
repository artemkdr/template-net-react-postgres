import callApi from '@/api/api';

export const login = async <T>(username: string, password: string) =>
    await callApi<T>('login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, Password: password }),
    });
