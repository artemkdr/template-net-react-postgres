import { User } from '@/features/users/types/user';
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';

export const UsersPage = (): ReactElement => {
    const data = useLoaderData() as User[];
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[] | undefined>(undefined);

    useEffect(() => {
        setUsers(data);
    }, [data]);

    return (
        <div className="text-left space-y-5">
            <h2>{t('Users.Title')}</h2>
            <ul>
                {users?.map((user) => (
                    <li key={user.Username}>
                        {user.Username} ({user.Status})
                    </li>
                ))}
            </ul>
        </div>
    );
};
