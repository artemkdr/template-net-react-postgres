import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Text } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Logout: FunctionComponent = () => {    
    const { t } = useTranslation();
    const logout = useAuthStore((s) => s.logout);

    useEffect(() => {
        logout();
    });

    return (
        <Text>{t("Chao!")}</Text>
    );
}