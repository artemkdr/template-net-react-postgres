import { convertToList, ListResponse } from '@/_foundation/types/list';
import { NotFound } from '@/app/pages/errors/not-found';
import { RouterError } from '@/app/pages/errors/router-error';
import Login from '@/app/pages/login';
import { Logout } from '@/app/pages/logout';
import { UsersPage } from '@/app/pages/users';
import { Welcome } from '@/app/pages/welcome';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { Layout } from '@/features/layout/layout';
import { getUsers } from '@/features/users/api/users';
import {
    convertToUserList,
    User,
    UserResponse,
} from '@/features/users/types/user';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

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
                        // simulate long loading
                        /*await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );*/
                        const response =
                            await getUsers<ListResponse<UserResponse>>();
                        if (response.success) {
                            return convertToUserList(
                                convertToList<User>(response.data)?.List
                            );
                        }
                        throw new Error('LoaderError', {
                            cause: response.error,
                        });
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
