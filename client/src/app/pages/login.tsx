import { FunctionComponent, useState } from 'react';

import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdEmail, MdPassword } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import callApi from '@/lib/api';
import { useAuthStore } from '@/features/auth/stores/auth-store';

const Login: FunctionComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const nav = useNavigate();

  const keyDownHandler = (evt : any) => {    
    if (evt.key === "Enter") {
      handleLogin();
    }
  }

  const handleLogin = async () => {
    setIsLoading(true);
        
    const response = await callApi(`login`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Username: username, Password: password }) 
    });    
    if (response.ok) {
      setErrorMessage('');      
      let token = (await response.json())?.token;      
      if (token != null) {
        login(token);              
        // reload last path  
        nav(document.location.pathname + document.location.search);
      } else {
        logout();
        setErrorMessage(t("Message.LoginError"));
      }      
    } else {
      logout();
      console.log(username + " - " + password);
      console.log(response);
      console.log(response.status);
      if (response.status === 401) {
        setErrorMessage(t("Message.LoginErrorWrongCredentials"));
      } else {
        setErrorMessage(t("Message.LoginError"));
      }
    }
    setIsLoading(false);
  };

  return(
    <Center mt={10}>
      <FormControl as="fieldset" maxWidth='400px' padding={4} border='1px solid #ccc' borderRadius={4}>      
        <Stack spacing={4}>
          <FormLabel>{t("Login.Title")}</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <MdEmail />
            </InputLeftElement>
            <Input placeholder={t("Login.Username")} id='login' value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={keyDownHandler} />
          </InputGroup>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <MdPassword />
            </InputLeftElement>
            <Input type='password' placeholder={t("Login.Password")} id='password' value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={keyDownHandler} />
          </InputGroup>
          <Text hidden={errorMessage == null || errorMessage === ''} color='red'>{errorMessage}</Text>          
          <Button onClick={handleLogin} background='green' color='white' disabled={isLoading}>{t("Login.Button")}</Button>      
        </Stack>      
      </FormControl>
    </Center>
  );
};

export default Login;