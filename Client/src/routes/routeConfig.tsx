import EditWordPack from "@/components/EditWordPack/EditWordPack";
import Explore from "@/components/Explore/Explore";
import Home from "@/components/Home/Home.tsx";
import HomePageLayout from "@/components/Layout/HomePageLayout";
import Quiz from "@/components/Quiz/Quiz";
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
			{
				path: "/practice/:wordPackId",
				element: (
					<HomePageLayout>
						<Quiz />
					</HomePageLayout>
				),
			},
			{
				path: "/edit",
				element: (
					<HomePageLayout>
						<EditWordPack />
					</HomePageLayout>
				),
				children: [
					{
						path: "/edit/:wordPackId",
						element: (
							<HomePageLayout>
								<EditWordPack />
							</HomePageLayout>
						),
					},
				],
			},
			{
				path: "/explore",
				element: (
					<HomePageLayout>
						<Explore />
					</HomePageLayout>
				),
			},
		],
	},
]);
