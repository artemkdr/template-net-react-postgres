import { callApi } from '@/lib/api/api';

export const touch = async <T>(token: string | null = null) => {
    return callApi<T>('touch', {}, token);
};
