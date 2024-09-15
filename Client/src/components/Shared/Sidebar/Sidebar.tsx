import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

import classNames from "classnames";
import {
	ChevronLeftCircle,
	ChevronRightCircle,
	Compass,
	House,
	LogOut,
	Menu,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import styles from "./Sidebar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@/api/AuthApis";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthProvider";

export default function Sidebar() {
	const [isExpanded, setIsExpanded] = useState(true);
	const navigate = useNavigate();
	const auth = useAuth();

	const sidebarItems = [
		{
			name: "Home",
			icon: <House size={"30px"} />,
			redirect: "/home",
			id: 1,
			onClick: () => {},
		},
		{
			name: "Explore",
			icon: <Compass size={"30px"} />,
			redirect: "/explore",
			id: 2,
			onClick: () => {},
		},
		{
			name: "Sign out",
			icon: <LogOut size={"30px"} />,
			redirect: "/home",
			id: 3,
			onClick: () => {
				auth.setUser({
					isLoggedIn: auth.isLoggedIn,
					user: auth.user,
					isLoading: true,
					fetchUser: false,
				});
				logOutMutation.mutate();
			},
		},
	];
	const logOutMutation = useMutation({
		mutationFn: logout,
		onError: (e) => {
			console.log(e);
		},
		onSuccess: () => {
			auth.setUser({
				isLoggedIn: false,
				user: undefined,
				isLoading: false,
				fetchUser: false,
			});
		},
	});
	return (
		<>
			<Drawer>
				<DrawerTrigger className={styles.smContainer}>
					<div
						style={{
							border: "1px solid white",
							borderRadius: "50%",
							background: "white",
							width: "40px",
							height: "40px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Menu color="black" />
					</div>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader className="flex justify-center">
						<DrawerTitle>Menu</DrawerTitle>
					</DrawerHeader>
					<DrawerFooter className="flex flex-col gap-4">
						{sidebarItems.map((item, index) => {
							return (
								<Link
									key={item.id}
									className="flex gap-6 justify-center"
									to={item.redirect}
									onClick={item.onClick}
								>
									<DrawerClose
										className="flex gap-6 justify-center"
										key={index}
									>
										{item.icon}
										{item.name}
									</DrawerClose>
								</Link>
							);
						})}
					</DrawerFooter>
				</DrawerContent>
			</Drawer>

			<aside
				className={classNames(
					styles.container,
					isExpanded ? styles.expanded : styles.collapsed
				)}
			>
				<div className={classNames(styles.sidebarBtnContainer)}>
					<div onClick={() => navigate("/")} className={"flex justify-center"}>
						<Button variant={"link"} className="flex gap-4">
							<div>
								<Zap size={"40px"} />
							</div>
							{isExpanded && <p className="text-3xl">Cards</p>}
						</Button>
					</div>
					<div className="relative">
						<button
							className={styles.toggleButton}
							onClick={() => setIsExpanded(!isExpanded)}
						>
							{isExpanded ? (
								<ChevronLeftCircle size={"25px"} />
							) : (
								<ChevronRightCircle size={"25px"} />
							)}
						</button>
					</div>
					<div className={styles.navigationBtn}>
						{sidebarItems.map((item, index) => {
							return (
								<div key={index} className="w-full">
									<Link className="w-full" to={item.redirect}>
										<Button
											onClick={item.onClick}
											variant={"ghost"}
											className={classNames(
												`${styles.sidebarBtn} ${
													isExpanded ? "gap-6" : "gap-0"
												} py-8`,
												"w-full flex justify-start"
											)}
										>
											<div>{item.icon}</div>
											<p
												className={classNames(
													isExpanded
														? styles.expandedText
														: styles.collapsedText
												)}
											>
												{item.name}
											</p>
										</Button>
									</Link>
								</div>
							);
						})}
					</div>
				</div>
			</aside>
		</>
	);
}
