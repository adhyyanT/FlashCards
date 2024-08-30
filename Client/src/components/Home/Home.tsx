import { getUserWordPacks } from "@/api/WordPackApis";
import { useAuth } from "@/context/AuthProvider";
import styles from "./Home.module.css";

import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { BookOpenText } from "lucide-react";
import { Link } from "react-router-dom";
import { Page } from "../Shared/Page/Page";

export default function Home() {
	const title = "My Library";
	const auth = useAuth();
	const totalColor = 8;

	const { data, isLoading } = useQuery({
		queryKey: ["WordPack", "user"],
		queryFn: () => getUserWordPacks(),
		enabled: auth.isLoggedIn,
		staleTime: Infinity,
		retry: (count) => {
			return count < 0;
		},
	});

	if (auth.isLoading) {
		return <div>Loading</div>;
	}
	if (isLoading) {
		return <div>Loading your library</div>;
	}

	if (!auth.isLoggedIn) {
		return (
			<Page icon={<BookOpenText size={30} />} title={title}>
				Sign up now to create your library of words.
			</Page>
		);
	}
	if (!data) return <h1>err</h1>;

	if (!data.status) {
		return (
			<Page icon={<BookOpenText size={30} />} title={title}>
				Server Error: {data.data.error}
			</Page>
		);
	}
	const wordPacks = data.data;

	return (
		<Page icon={<BookOpenText size={30} />} title={title} className="gap-4">
			{wordPacks.map((d) => {
				return (
					<Link
						to={`/practice/${d.wordPackId}`}
						relative="route"
						key={d.wordPackId}
						className={classNames(
							styles.card,
							styles[
								`cardBackground${Math.floor(Math.random() * (totalColor + 1))}`
							]
						)}
					>
						{d.name}
					</Link>
				);
			})}
		</Page>
	);
}
