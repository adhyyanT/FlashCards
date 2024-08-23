import Home from "@/components/Home/Home.tsx";
import HomePageLayout from "@/components/Layout/HomePageLayout";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

export const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <h1>Page not found</h1>,
		element: <Outlet />,
		children: [
			{
				index: true,
				element: <Navigate to={"/home"} />,
			},
			{
				path: "/home",
				element: (
					<HomePageLayout>
						<Home />
					</HomePageLayout>
				),
			},
		],
	},
]);
