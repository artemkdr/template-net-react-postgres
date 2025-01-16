import { useAuthStore } from '@/features/auth/stores/auth-store';
import { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const Logout: FunctionComponent = () => {
    const { t } = useTranslation();
    const logout = useAuthStore((s) => s.logout);

    useEffect(() => {
        logout();
    });

    return <p>{t('Chao!')}</p>;
};
