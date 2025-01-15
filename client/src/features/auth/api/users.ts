import { useAuthStore } from '@/features/auth/stores/auth-store';
import callApi from '@/lib/api/api';

export const getUsers = async <T>() =>
    await callApi<T>('users', {}, useAuthStore.getState().token);
export const getUser = async <T>(username: string) =>
    await callApi<T>(`users/${username}`, {}, useAuthStore.getState().token);
