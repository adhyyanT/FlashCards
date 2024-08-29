import { getUserWordPacks } from "@/api/WordPackApis";
import { useAuth } from "@/context/AuthProvider";
import styles from "./Home.module.css";

import { useQuery } from "@tanstack/react-query";
import { BookOpenText } from "lucide-react";
import { ReactNode, useEffect } from "react";
import classNames from "classnames";

export default function Home() {
	const auth = useAuth();
	const totalColor = 8;
	const { data, refetch } = useQuery({
		queryKey: ["WordPack", "user"],
		queryFn: getUserWordPacks,
		enabled: false,
		retry: false,
	});

	useEffect(() => {
		if (auth.isLoggedIn) refetch();
		return () => {};
	}, [auth.user]);

	if (!auth.isLoggedIn) {
		return <HomePage>Sign up now to create your library of words.</HomePage>;
	}
	if (!data) return <h1>err</h1>;

	if (!data.status) {
		return <HomePage>Server Error: {data.data.error}</HomePage>;
	}
	const wordPacks = data.data;

	return (
		<HomePage className="gap-4">
			{wordPacks.map((d) => {
				return (
					<div
						key={d.wordPackId}
						className={classNames(
							styles.card,
							styles[
								`cardBackground${Math.floor(Math.random() * (totalColor + 1))}`
							]
						)}
					>
						{d.name}
					</div>
				);
			})}
		</HomePage>
	);
}

const HomePage = ({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<div className={styles.homeHeader}>
			<div className="flex gap-2 items-end">
				{" "}
				<BookOpenText size={30} />
				<span className="text-3xl ">My Library</span>
			</div>
			<div className={classNames(styles.contentArea, className)}>
				{children}
			</div>
		</div>
	);
};
