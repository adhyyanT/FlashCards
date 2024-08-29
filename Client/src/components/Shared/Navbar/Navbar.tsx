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
	const user = useAuth();

	const logOutMutation = useMutation({
		mutationFn: logout,
		onError: (e) => {
			console.log(e);
		},
		onSuccess: () => {
			console.log("here");

			user.setUser({
				isLoggedIn: false,
				user: undefined,
			});
		},
	});

	const location = useLocation();
	const [title, setTitle] = useState("");

	const handleLogout = () => {
		logOutMutation.mutate();
	};

	useEffect(() => {
		const paths = location.pathname.split("/");
		if (paths.length > 0) {
			setTitle(paths[paths.length - 1]);
		}
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.title}>{title}</div>
			<div>
				{user.isLoggedIn ? (
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
			</div>
		</div>
	);
}
