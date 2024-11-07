import { callApi } from "@/features/auth/api/api";

export const touch = async (token : string | null = null) => {
    return callApi("touch", {}, token);
}