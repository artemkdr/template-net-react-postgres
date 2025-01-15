import { SimpleSuspense } from '@/components/simple-suspense';
import { User } from '@/features/users/types/user';
import { Heading, Text, VStack } from '@chakra-ui/react';
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

export const UsersPage = (): ReactElement => {
    const data = useLoaderData() as User[];
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[] | undefined>(undefined);

    useEffect(() => {
        setUsers(data);
    }, [data]);

    return (
        <VStack align={'left'} spacing={5}>
            <Heading as="h2" size="md">
                {t('Users.Title')}
            </Heading>
            <SimpleSuspense
                fallback={<Text>{t('Loading')}</Text>}
                emptyText={t('Users.Empty')}
            >
                {users?.map((user) => (
                    <Text key={user.Username}>
                        {user.Username} ({user.Status})
                    </Text>
                ))}
            </SimpleSuspense>
        </VStack>
    );
};
