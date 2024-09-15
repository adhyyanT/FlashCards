import { getPublicPacks } from "@/api/WordPackApis";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { CircleUser, Telescope } from "lucide-react";
import AddToWordPack from "../AddToWordPack/AddToWordPack";
import { Page } from "../Shared/Page/Page";
import { Dialog, DialogTrigger } from "../ui/dialog";
import styles from "./Explore.module.css";
import { publicWordPackKey } from "@/utils/queryKeys";

const Explore = () => {
	const title = "Explore";
	const totalColor = 8;

	const { data, isLoading } = useQuery({
		queryKey: publicWordPackKey(),
		queryFn: getPublicPacks,
		staleTime: Infinity,
		retry: (count) => {
			return count < 0;
		},
	});

	if (isLoading) {
		return <div>Loading packs</div>;
	}
	if (!data) return <h1>err</h1>;
	if (!data.status) {
		return (
			<Page icon={<Telescope size={30} />} title={title}>
				Server Error: {data.data.error}
			</Page>
		);
	}
	const wordPacks = data.data;
	return (
		<div className={styles.homeHeader}>
			<div className={styles.header}>
				<div className="flex gap-2 items-end">
					<Telescope size={32} />
					<span className={styles.headerTitle}>Explore</span>
				</div>
			</div>
			<div className={classNames(styles.contentArea, "gap-4")}>
				{wordPacks.map((d) => {
					const colorClass = `cardBackground${Math.floor(
						Math.random() * (totalColor + 1)
					)}`;
					return (
						<Dialog key={d.wordPackId}>
							<DialogTrigger
								className={classNames(styles.card, styles[colorClass])}
							>
								<div className="flex flex-col items-center w-full h-full justify-between ">
									<div className="w-full text-lg font-semibold flex justify-start">
										<span>{d.name}</span>
									</div>
									<div className="flex justify-end w-full">
										<span className="flex gap-1">
											<CircleUser />{" "}
											<span className={styles.createdBy}>{d.user}</span>
										</span>
									</div>
								</div>
							</DialogTrigger>
							<AddToWordPack
								title={d.name}
								createdBy={d.user}
								colorClass={colorClass}
								wordPackId={d.wordPackId}
							/>
						</Dialog>
					);
				})}
			</div>
		</div>
	);
};

export default Explore;
