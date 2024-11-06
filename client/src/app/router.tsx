import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "@/features/layout/layout";
import callApi from "@/lib/api";
import Login from "@/app/pages/login";
import { NotFound } from "@/app/pages/errors/not-found";
import { RouterError } from "@/app/pages/errors/router-error";
import { UsersPage } from "@/app/pages/users";
import { Welcome } from "@/app/pages/welcome";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { AuthContext } from "@/features/layout/contexts/auth-context";

export const AppRouter: React.FC = () => {
	const authStore = useAuthStore();

	const router = createBrowserRouter([
		{
			path: '/',
			element: 
				<ErrorBoundary FallbackComponent={RouterError}>
					<AuthContext.Provider 
						value={{ 
							isLoggedIn: authStore.isLoggedIn, 
							userName: authStore.getUserName(), 
							logout: authStore.logout, 
							login: authStore.login 
						}}>
						<Layout />
					</AuthContext.Provider>
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
						const response = await callApi(`user`);
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