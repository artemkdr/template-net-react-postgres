import Login from '@/app/pages/login';
import { useAuthStore } from '@/features/auth/stores/auth-store';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';

interface IError {
    error?: Error;
    status?: number;
    cause?: number;
}

interface RouterErrorProps {
    error?: Error; // Make the error prop optional
}

export const RouterError = ({ error }: RouterErrorProps) => {
    const { t } = useTranslation();
    const nav = useNavigate();
    const authStore = useAuthStore();
    const displayedError: unknown = useRouteError() ?? error;
    const [isOpened, setIsOpened] = useState(true);
    const onClose = () => {
        setIsOpened(false);
        nav('/');
    };
    let errorMessage: string;

    if (isRouteErrorResponse(displayedError)) {
        // error is type `ErrorResponse`
        errorMessage =
            (displayedError as IError)?.error?.message ||
            displayedError.statusText;
    } else if (displayedError instanceof Error) {
        errorMessage = displayedError.message;
    } else if (typeof displayedError === 'string') {
        errorMessage = displayedError;
    } else {
        errorMessage = t('Message.UnknownError');
    }
    const isAuthError =
        (displayedError as IError)?.status === 401 ||
        (displayedError as IError)?.cause === 401 ||
        !authStore.isLoggedIn;
    if (isAuthError) {
        return <Login />;
    }
    if (
        (displayedError as IError)?.status === 403 ||
        (displayedError as IError)?.cause === 403
    )
        errorMessage = 'ForbidError';
    return (
        <div
            className={`fixed inset-0 flex items-center justify-center ${isOpened ? 'block' : 'hidden'}`}
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold">
                        {t('Message.RouterError')}
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <div className="py-4">
                    <p>{t('Message.' + errorMessage)}</p>
                </div>
                <div className="flex justify-end pt-3 border-t">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => nav('/')}
                    >
                        {t('OK')}
                    </button>
                </div>
            </div>
        </div>
    );
};
