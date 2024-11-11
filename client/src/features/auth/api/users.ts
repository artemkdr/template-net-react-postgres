import callApi from "@/lib/api/api"
import { useAuthStore } from "@/features/auth/stores/auth-store";

export const getUsers = async () => callApi("user", {}, useAuthStore.getState().token);
export const getUser = async (username : string) => callApi(`user/${username}`, {}, useAuthStore.getState().token);