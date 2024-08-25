import { CircleUser } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { AuthDialog } from "@/components/AuthDialog/AuthDialog";
import { useAuth } from "@/context/AuthProvider";

export default function Navbar() {
	const user = useAuth();

	const location = useLocation();
	const [title, setTitle] = useState("");
	useEffect(() => {
		const paths = location.pathname.split("/");
		if (paths.length > 0) {
			setTitle(paths[paths.length - 1]);
		}
	}, []);
	return (
		<div className={styles.container}>
			<div className={styles.title}>{title}</div>
			<div>{user.isLoggedIn ? <CircleUser size={30} /> : <AuthDialog />}</div>
		</div>
	);
}
