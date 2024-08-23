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

export default function Sidebar() {
	const [isExpanded, setIsExpanded] = useState(true);

	const sidebarItems = [
		{
			name: "Home",
			icon: <House size={"30px"} />,
		},
		{
			name: "Explore",
			icon: <Compass size={"30px"} />,
		},
		{
			name: "Sign out",
			icon: <LogOut size={"30px"} />,
		},
	];

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
								<DrawerClose className="flex gap-6 justify-center" key={index}>
									{item.icon}
									{item.name}
								</DrawerClose>
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
					<div className={"flex justify-center"}>
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
									<Button
										variant={"ghost"}
										className={`${styles.sidebarBtn} ${
											isExpanded ? "gap-6" : "gap-0"
										} py-8`}
									>
										<div>{item.icon}</div>
										<p
											className={classNames(
												isExpanded ? styles.expandedText : styles.collapsedText
											)}
										>
											{item.name}
										</p>
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			</aside>
		</>
	);
}
