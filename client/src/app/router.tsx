import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "@/features/layout/layout";
import { getUsers } from "@/features/auth/api/users";
import Login from "@/app/pages/login";
import { NotFound } from "@/app/pages/errors/not-found";
import { RouterError } from "@/app/pages/errors/router-error";
import { UsersPage } from "@/app/pages/users";
import { Welcome } from "@/app/pages/welcome";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Logout } from "@/app/pages/logout";

export const AppRouter: React.FC = () => {
	const authStore = useAuthStore();
	
	const router = createBrowserRouter([
		{
			path: '/',
			element: 
				<ErrorBoundary FallbackComponent={RouterError}>
					<Layout authContext={{isLoggedIn: authStore.isLoggedIn, username: authStore.getUserName()}} />
				</ErrorBoundary>,
			errorElement: <RouterError />,				
			children: [
				{
					index: true,
					path: '/',
					element: <Navigate to={'/welcome'} replace={true} />
				},
				{				
					path: '/welcome',
					element: <Welcome />				
				},			
				{				
					path: '/users',
					element: <UsersPage />,
					loader: async() => {											
						const response = await getUsers();
						if (response.ok) {
							var json = await response.json();
							return json;
						}
						throw new Error("LoaderError");
					}
				},			
				{				
					path: '/login',
					element: !authStore.isLoggedIn ? <Login /> : <Navigate to={'/welcome'} replace={true} />
				},			
				{				
					path: '/logout',					
					element: <Logout />					
				},			
				{
					path: '*',
					element: <NotFound />,
				},
			],
		},
	]);
	return (
		<RouterProvider router={router} />	   
	)
}