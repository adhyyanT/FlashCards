import classNames from "classnames";
import { ReactElement, ReactNode } from "react";
import styles from "./Page.module.css";

export const Page = ({
	children,
	className = "",
	title,
	icon,
}: {
	children: ReactNode;
	title: string;
	icon: ReactElement;
	className?: string;
}) => {
	return (
		<div className={styles.homeHeader}>
			<div className="flex gap-2 items-end">
				{" "}
				{icon}
				<span className="text-3xl ">{title}</span>
			</div>
			<div className={classNames(styles.contentArea, className)}>
				{children}
			</div>
		</div>
	);
};
