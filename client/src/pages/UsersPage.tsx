import { Heading, Text, VStack } from '@chakra-ui/react';
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { convertDataToUserList, User } from '../models/User';

export const UsersPage: FunctionComponent = (): ReactElement => {
	const data : any = useLoaderData();        
    const { t } = useTranslation();
	const [users, setUsers] = useState<User[]>([] as User[]);

	useEffect(() => {      
        setUsers(convertDataToUserList(data));    
    }, [data]);

	return (
		<VStack align={"left"} spacing={5}>
            <Heading as="h2" size="md">{t("Users.Title")}</Heading>
			{users.length > 0 ? 
				users.map(user => (
					<Text key={user.Username}>${user.Username}</Text>
				)) :
				<Text>{t("Users.Empty")}</Text>
			}			
		</VStack>
	)
}