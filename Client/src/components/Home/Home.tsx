import { getUserWordPacks } from "@/api/WordPackApis";
import { useAuth } from "@/context/AuthProvider";
import styles from "./Home.module.css";

import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { BookOpenText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Page } from "../Shared/Page/Page";
import { useEffect, useState } from "react";
import { WordPack } from "@/types/wordPack";
import { userWordPackKey } from "@/utils/queryKeys";

export default function Home() {
	const title = "My Library";
	const auth = useAuth();
	const totalColor = 8;

	const { data, isLoading, isRefetching } = useQuery({
		queryKey: userWordPackKey(),
		queryFn: () => getUserWordPacks(),
		enabled: auth.isLoggedIn,
		staleTime: Infinity,
		retry: (count) => {
			return count < 0;
		},
	});

	const [wordPacks, setWordPacks] = useState<WordPack[]>([]);

	useEffect(() => {
		if (data && data.status) {
			const t = [...data.data];
			t.unshift({
				isPublic: false,
				name: "Create Word Pack",
				wordPackDetails: [],
				wordPackId: -1,
				user: "",
			});
			setWordPacks(t);
		}
	}, [data]);

	if (auth.isLoading) {
		return <div>Loading</div>;
	}
	if (isLoading || isRefetching) {
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

	return (
		<Page icon={<BookOpenText size={30} />} title={title} className="gap-4">
			{wordPacks.map((d, index) => {
				return (
					<Link
						to={`${index === 0 ? "/edit" : `/practice/${d.wordPackId}`}`}
						relative="route"
						key={d.wordPackId}
						className={classNames(
							styles.card,
							index !== 0 &&
								styles[
									`cardBackground${Math.floor(
										Math.random() * (totalColor + 1)
									)}`
								],
							index === 0 && styles.createCard
						)}
					>
						<div className="flex flex-col items-center">
							{index === 0 && <Plus size={32} />}{" "}
							<span className="text-lg font-semibold">{d.name}</span>
						</div>
					</Link>
				);
			})}
		</Page>
	);
}
