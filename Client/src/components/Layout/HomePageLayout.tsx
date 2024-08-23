import { ReactElement } from "react";
import Navbar from "../Shared/Navbar/Navbar";
import styles from "./HomePageLayout.module.css";
import Sidebar from "../Shared/Sidebar/Sidebar";

function HomePageLayout({ children }: { children: ReactElement }) {
	return (
		<div className={styles.mainContainer}>
			<Sidebar />
			<div className={styles.navContentContainer}>
				<Navbar />
				{children}
			</div>
		</div>
	);
}

export default HomePageLayout;
