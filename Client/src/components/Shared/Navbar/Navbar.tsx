import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
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
			<div>{title}</div>
			<div>profile</div>
		</div>
	);
}
