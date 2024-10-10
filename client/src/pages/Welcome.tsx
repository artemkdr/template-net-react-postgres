import { Heading, VStack } from '@chakra-ui/react';
import { FunctionComponent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';

export const Welcome: FunctionComponent = (): ReactElement => {	
    const { t } = useTranslation();
	const authStore = useAuthStore();
	
	return (
		<VStack align={"left"} spacing={5}>
            <Heading as="h2" size="md">{t("Salutation", {user: authStore.getUserName()})}</Heading>			
		</VStack>
	)
}