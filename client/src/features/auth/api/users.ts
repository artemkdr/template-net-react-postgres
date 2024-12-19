import callApi from "@/lib/api/api"
import { useAuthStore } from "@/features/auth/stores/auth-store";

export const getUsers = async () => callApi("users", {}, useAuthStore.getState().token);
export const getUser = async (username : string) => callApi(`users/${username}`, {}, useAuthStore.getState().token);