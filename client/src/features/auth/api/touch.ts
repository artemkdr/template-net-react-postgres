import { callApi } from '@/api/api';

export const touch = async <T>(token: string | null = null) => {
    return callApi<T>('touch', {}, token);
};
