import { getWordDetails } from "@/api/WordPackApis";
import { useAuth } from "@/context/AuthProvider";
import { WordPackDetails } from "@/types/wordPack";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { Check, CircleX, FlaskConical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "../Shared/Page/Page";
import { Button } from "../ui/button";
import styles from "./Quiz.module.css";

const Quiz = () => {
	const title = "Quiz";
	const { wordPackId } = useParams();
	const auth = useAuth();
	const navigate = useNavigate();
	const { data, isLoading } = useQuery({
		queryKey: ["practice", wordPackId],
		queryFn: () => {
			if (wordPackId) {
				return getWordDetails(+wordPackId);
			}
		},
		retry: (count) => {
			return count < 0;
		},
		enabled: auth.isLoggedIn,
		staleTime: Infinity,
	});
	const [showFirst, setShowFirst] = useState(true);
	const [wordDetails, setWordDetails] = useState<WordPackDetails[]>([]);
	const [index, setIndex] = useState(0);
	const [nextIndex, setNextIndex] = useState(1);

	const card1Ref = useRef<HTMLDivElement>(null);
	const card2Ref = useRef<HTMLDivElement>(null);

	const card1FaceRef = useRef<HTMLDivElement>(null);
	const card2FaceRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!auth.isLoggedIn) {
			navigate("/home");
			return;
		}
		if (data && data.status) {
			setWordDetails(data.data);
		}
	}, [auth.user, data]);

	if (isLoading) {
		return <div>Loading</div>;
	}

	if (!data) {
		return <p>Err</p>;
	}
	if (!data.status) {
		return <p>Unauthorized: {data.data.error}</p>;
	}

	const handleNext = () => {
		if (showFirst) {
			if (nextIndex < wordDetails.length)
				card2Ref.current?.classList.add(styles.showCard);
			card1Ref.current?.classList.add(styles.correctAnswer);
			card2Ref.current?.classList.remove(styles.correctAnswer);
		} else {
			if (index < wordDetails.length)
				card1Ref.current?.classList.add(styles.showCard);
			card2Ref.current?.classList.add(styles.correctAnswer);
			card1Ref.current?.classList.remove(styles.correctAnswer);
		}
		card1FaceRef.current?.classList.remove(styles.flipCard);
		card2FaceRef.current?.classList.remove(styles.flipCard);
		setTimeout(() => {
			if (showFirst) {
				setIndex(index + 2);
			} else {
				setNextIndex(nextIndex + 2);
			}
			setShowFirst(!showFirst);
		}, 600);
	};
	const flipCard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.currentTarget.classList.toggle(styles.flipCard);
	};
	return (
		<Page
			className={classNames(
				"h-full flex justify-start items-center flex-col gap-4"
			)}
			icon={<FlaskConical size={30} />}
			title={title}
		>
			{index < wordDetails.length || nextIndex < wordDetails.length ? (
				<div
					className={classNames(
						"flex justify-start items-center flex-col relative max-w-[880px]",
						styles.container
					)}
				>
					<div
						ref={card1Ref}
						className={classNames(
							styles.cardContainer,
							showFirst ? "z-10" : "z-0 hidden"
						)}
					>
						<div
							ref={card1FaceRef}
							onClick={(e) => flipCard(e)}
							className={styles.card}
						>
							<div className={styles.cardFront}>
								{index < wordDetails.length && (
									<p className="text-2xl">{wordDetails[index].word}</p>
								)}
							</div>
							<div className={styles.cardBack}>
								{index < wordDetails.length && (
									<p className="text-2xl">{wordDetails[index].meaning}</p>
								)}
							</div>
						</div>
					</div>
					<div
						ref={card2Ref}
						className={classNames(
							styles.cardContainer,
							showFirst ? "z-0 hidden" : "z-10"
						)}
					>
						<div
							ref={card2FaceRef}
							onClick={(e) => flipCard(e)}
							className={styles.card}
						>
							<div className={styles.cardFront}>
								{nextIndex < wordDetails.length && (
									<p className="text-2xl">{wordDetails[nextIndex].word}</p>
								)}
							</div>
							<div className={styles.cardBack}>
								{nextIndex < wordDetails.length && (
									<p className="text-2xl">{wordDetails[nextIndex].meaning}</p>
								)}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="h-full w-full justify-center items-center flex">
					<p>All caught up</p>
				</div>
			)}
			{/* <span>
				<p>Did you get that?</p>
			</span> */}
			{(index < wordDetails.length || nextIndex < wordDetails.length) && (
				<div className="flex justify-around w-full">
					<Button
						onClick={handleNext}
						variant={"outline"}
						className="p-8"
						size={"lg"}
					>
						<CircleX color="red" size={45} />
					</Button>
					<Button
						onClick={handleNext}
						variant={"outline"}
						className="p-8"
						size={"lg"}
					>
						<Check color="green" size={45} />
					</Button>
				</div>
			)}
		</Page>
	);
};

export default Quiz;
