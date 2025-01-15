import { NotFound } from '@/app/pages/errors/not-found';
import { RouterError } from '@/app/pages/errors/router-error';
import Login from '@/app/pages/login';
import { Logout } from '@/app/pages/logout';
import { UsersPage } from '@/app/pages/users';
import { Welcome } from '@/app/pages/welcome';
import { getUsers } from '@/features/auth/api/users';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { Layout } from '@/features/layout/layout';
import { convertToUserList, User, UserResponse } from '@/features/users/types/user';
import { convertToList, ListResponse } from '@/lib/types/list';
import { ErrorBoundary } from 'react-error-boundary';
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom';

export const AppRouter: React.FC = () => {
    const authStore = useAuthStore();

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <ErrorBoundary FallbackComponent={RouterError}>
                    <Layout
                        authContext={{
                            isLoggedIn: authStore.isLoggedIn,
                            username: authStore.getUserName(),
                        }}
                    />
                </ErrorBoundary>
            ),
            errorElement: <RouterError />,
            children: [
                {
                    index: true,
                    path: '/',
                    element: <Navigate to={'/welcome'} replace={true} />,
                },
                {
                    path: '/welcome',
                    element: <Welcome />,
                },
                {
                    path: '/users',
                    element: <UsersPage />,
                    loader: async () => {
                        const response = await getUsers<ListResponse<UserResponse>>();
                        if (response.success) {
                            return convertToUserList(convertToList<User>(response.data)?.List);
                        }
                        throw new Error('LoaderError');
                    },
                },
                {
                    path: '/login',
                    element: !authStore.isLoggedIn ? (
                        <Login />
                    ) : (
                        <Navigate to={'/welcome'} replace={true} />
                    ),
                },
                {
                    path: '/logout',
                    element: <Logout />,
                },
                {
                    path: '*',
                    element: <NotFound />,
                },
            ],
        },
    ]);
    return <RouterProvider router={router} />;
};
