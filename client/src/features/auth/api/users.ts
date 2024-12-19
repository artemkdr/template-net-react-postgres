import { useAuthStore } from '@/features/auth/stores/auth-store';
import callApi from '@/lib/api/api';

export const getUsers = async () =>
    callApi('users', {}, useAuthStore.getState().token);
export const getUser = async (username: string) =>
    callApi(`users/${username}`, {}, useAuthStore.getState().token);
