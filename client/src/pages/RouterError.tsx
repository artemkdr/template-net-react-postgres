import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, Button } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'
import Login from './Login';
import { useAuthStore } from '../stores/authStore';

type RouterErrorProps = {
	error?: Error; // Make the error prop optional	
};

export const RouterError = ({ error } : RouterErrorProps) => {
	const { t } = useTranslation();
	const nav = useNavigate();
	const cancelRef = useRef(null);	
	const authStore = useAuthStore();
	const displayedError: unknown = useRouteError() ?? error;
	const [isOpened, setIsOpened] = useState(true);
	const onClose = () => {
		setIsOpened(false); 
		nav("/");
	}
	let errorMessage: string;
		
	if (isRouteErrorResponse(displayedError)) {
		// error is type `ErrorResponse`
		errorMessage = (displayedError as any).error?.message || displayedError.statusText;
	} else if (displayedError instanceof Error) {
		errorMessage = displayedError.message;
	} else if (typeof displayedError === 'string') {
		errorMessage = displayedError;
	} else {		
		errorMessage = t('Message.UnknownError');
	}	
	const isAuthError = (displayedError as any)?.status === 401 || (displayedError as any)?.cause === 401 || !authStore.isLoggedIn;
	if (isAuthError) {
		return <Login />;
	}
	if ((displayedError as any)?.status === 403 || (displayedError as any)?.cause === 403)
		errorMessage = "ForbidError";
	return (		
		<AlertDialog isOpen={isOpened} onClose={onClose} leastDestructiveRef={cancelRef}>
			<AlertDialogContent>
				<AlertDialogHeader>{t("Message.RouterError")}</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>{t("Message." + errorMessage)}</AlertDialogBody>
				<AlertDialogFooter>				
					<Button colorScheme='green' ml={3} onClick={() => nav("/")}>{t("OK")}</Button>					
				</AlertDialogFooter>
			</AlertDialogContent>			
		</AlertDialog>
		
	);
}