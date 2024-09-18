import { AuthDialog } from "@/components/AuthDialog/AuthDialog";
import { useAuth } from "@/context/AuthProvider";
import { CircleUser, LogOut, UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/AuthApis";

export default function Navbar() {
	const auth = useAuth();

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

	const location = useLocation();
	const [title, setTitle] = useState("");

	const handleLogout = () => {
		auth.setUser({
			isLoggedIn: auth.isLoggedIn,
			user: auth.user,
			isLoading: true,
			fetchUser: false,
		});
		logOutMutation.mutate();
	};

	useEffect(() => {
		const paths = location.pathname.split("/");
		if (paths.length >= 1) {
			setTitle(paths[1]);
		}
	}, [location.pathname]);

	return (
		<div className={styles.container}>
			<div className={styles.title}>{title}</div>
			<nav>
				{auth.isLoggedIn ? (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<CircleUser size={30} />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="flex justify-around">
								<UserRoundPen />
								Profile
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={handleLogout}
								className="flex justify-around"
							>
								<LogOut />
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<AuthDialog />
				)}
			</nav>
		</div>
	);
}
