import { useAuthStore } from '@/features/auth/stores/auth-store';
import { FunctionComponent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const Welcome: FunctionComponent = (): ReactElement => {
    const { t } = useTranslation();
    const authStore = useAuthStore();

    return (
        <div className="w-full">
            <h2>{t('Salutation', { user: authStore.getUserName() })}</h2>
        </div>
    );
};
