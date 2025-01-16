import { FunctionComponent, KeyboardEvent, useState } from 'react';

import { login as apiLogin } from '@/features/auth/api/login';
import { useAuthStore } from '@/features/auth/stores/auth-store';

import { useTranslation } from 'react-i18next';
import { MdEmail, MdPassword } from 'react-icons/md';
import { useNavigate } from 'react-router';

const Login: FunctionComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const login = useAuthStore((s) => s.login);
    const logout = useAuthStore((s) => s.logout);
    const nav = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);

        const response = await apiLogin<{ token: string }>(username, password);
        if (response.success) {
            setErrorMessage('');
            const token = response.data?.token;
            if (token != null) {
                login(token);
                // reload last path
                nav(document.location.pathname + document.location.search);
            } else {
                logout();
                setErrorMessage(t('Message.LoginError'));
            }
        } else {
            logout();
            if (response.error?.status === 401) {
                setErrorMessage(t('Message.LoginErrorWrongCredentials'));
            } else {
                setErrorMessage(t('Message.LoginError'));
            }
        }
        setIsLoading(false);
    };

    const keyDownHandler = (evt: KeyboardEvent) => {
        if (evt.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <fieldset className="max-w-md p-4 border border-gray-300 rounded">
                <div className="space-y-4">
                    <label className="block text-lg font-medium">
                        {t('Login.Title')}
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <MdEmail />
                        </span>
                        <input
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded"
                            placeholder={t('Login.Username')}
                            id="login"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={keyDownHandler}
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <MdPassword />
                        </span>
                        <input
                            type="password"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded"
                            placeholder={t('Login.Password')}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={keyDownHandler}
                        />
                    </div>
                    <p
                        className={`text-red-500 ${errorMessage ? 'block' : 'hidden'}`}
                    >
                        {errorMessage}
                    </p>
                    <button
                        onClick={handleLogin}
                        className="w-full py-2 bg-green-500 text-white rounded disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {t('Login.Button')}
                    </button>
                </div>
            </fieldset>
        </div>
    );
};

export default Login;
