import { Router } from "@remix-run/router";
import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "../Layout";
import callApi from "../net/api";
import { NotFound } from "../pages/NotFound";
import { RouterError } from "../pages/RouterError";
import { UsersPage } from "../pages/UsersPage";
import { Welcome } from "../pages/Welcome";

export const router: Router = createBrowserRouter([
	{
		path: '/',
		element: <ErrorBoundary FallbackComponent={RouterError}><Layout /></ErrorBoundary>,
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
				loader: async({ params }) => {											
					const response = await callApi(`user`);
					if (response.ok) {
						var json = await response.json();
						return json;
					}
					throw new Error("LoaderError", { cause: response.status });
				}
			},			
			{
				path: '*',
				element: <NotFound />,
			},
		],
	},
]);

export const AppRouter: React.FC = () => {
	return (
		<RouterProvider router={router} />	   
	)
}