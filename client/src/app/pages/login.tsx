import { FunctionComponent, KeyboardEvent, useState } from 'react';

import { login as apiLogin } from '@/features/auth/api/login';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import {
    Button,
    Center,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdEmail, MdPassword } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

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

        const response = await apiLogin<{token: string}>(username, password);
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
        <Center mt={10}>
            <FormControl
                as="fieldset"
                maxWidth="400px"
                padding={4}
                border="1px solid #ccc"
                borderRadius={4}
            >
                <Stack spacing={4}>
                    <FormLabel>{t('Login.Title')}</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <MdEmail />
                        </InputLeftElement>
                        <Input
                            placeholder={t('Login.Username')}
                            id="login"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={keyDownHandler}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <MdPassword />
                        </InputLeftElement>
                        <Input
                            type="password"
                            placeholder={t('Login.Password')}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={keyDownHandler}
                        />
                    </InputGroup>
                    <Text
                        hidden={errorMessage == null || errorMessage === ''}
                        color="red"
                    >
                        {errorMessage}
                    </Text>
                    <Button
                        onClick={handleLogin}
                        background="green"
                        color="white"
                        disabled={isLoading}
                    >
                        {t('Login.Button')}
                    </Button>
                </Stack>
            </FormControl>
        </Center>
    );
};

export default Login;
