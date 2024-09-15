import { deleteWordPack, getWordPackDetails } from "@/api/WordPackApis";
import { useAuth } from "@/context/AuthProvider";
import { WordPackDetails } from "@/types/wordPack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import {
	Check,
	CircleX,
	FilePenLine,
	FlaskConical,
	Play,
	Shuffle,
	Trash,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../Card/Card";
import cardStyles from "../Card/Card.module.css";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
import styles from "./Quiz.module.css";
import {
	publicWordPackKey,
	userWordPackKey,
	wordPackDetailsKey,
} from "@/utils/queryKeys";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "../Shared/Spinner/LoadingSpinner";

const Quiz = () => {
	const title = "Quiz";
	const { wordPackId } = useParams();
	const auth = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: wordPackDetailsKey(wordPackId),
		queryFn: () => {
			if (wordPackId) {
				return getWordPackDetails(+wordPackId);
			}
		},
		retry: (count) => {
			return count < 0;
		},
		enabled: auth.isLoggedIn,
		staleTime: Infinity,
	});
	const deleteMutation = useMutation({
		mutationFn: deleteWordPack,
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: userWordPackKey(),
			});
			if (data && data.status && data.data.isPublic)
				queryClient.invalidateQueries({
					queryKey: publicWordPackKey(),
				});
			navigate("/");
		},
	});
	const [showFirst, setShowFirst] = useState(true);
	const [wordDetails, setWordDetails] = useState<WordPackDetails[]>([]);
	const [index, setIndex] = useState(0);
	const [nextIndex, setNextIndex] = useState(1);
	const [isAnimating, setIsAnimating] = useState(false);
	const [startQuiz, setStartQuiz] = useState(false);
	const [shuffle, setShuffle] = useState(false);

	const card1Ref = useRef<HTMLDivElement>(null);
	const card2Ref = useRef<HTMLDivElement>(null);

	const card1FaceRef = useRef<HTMLDivElement>(null);
	const card2FaceRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!auth.isLoggedIn && !auth.isLoading) {
			navigate("/home");
			return;
		}
		if (data && data.status) {
			setWordDetails([...data.data.wordPackDetails]);
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
	const shuffleWordDetails = () => {
		let currShuffle = !shuffle;
		setShuffle(currShuffle);
		if (currShuffle) {
			const array = wordDetails;
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			setWordDetails(array);
		} else {
			setWordDetails([...data.data.wordPackDetails]);
		}
	};

	const handleNext = (choice: boolean = true) => {
		if (isAnimating) return;
		setIsAnimating(true);

		if (showFirst) {
			if (nextIndex < wordDetails.length)
				card2Ref.current?.classList.add(styles.showCard);
			card1Ref.current?.classList.add(
				choice ? styles.correctAnswer : styles.wrongAnswer
			);
			card2Ref.current?.classList.remove(styles.correctAnswer);
			card2Ref.current?.classList.remove(styles.wrongAnswer);
		} else {
			if (index < wordDetails.length)
				card1Ref.current?.classList.add(styles.showCard);
			card2Ref.current?.classList.add(
				choice ? styles.correctAnswer : styles.wrongAnswer
			);
			card1Ref.current?.classList.remove(styles.correctAnswer);
			card1Ref.current?.classList.remove(styles.wrongAnswer);
		}
		card1FaceRef.current?.classList.remove(cardStyles.flipCard);
		card2FaceRef.current?.classList.remove(cardStyles.flipCard);
		setTimeout(() => {
			if (showFirst) {
				setIndex(index + 2);
			} else {
				setNextIndex(nextIndex + 2);
			}
			setShowFirst(!showFirst);
			setIsAnimating(false);
		}, 600);
	};

	return (
		<div className={styles.homeHeader}>
			<div className="flex justify-between items-center">
				<div className="flex gap-2 items-end">
					<FlaskConical size={30} />
					<span className="text-3xl ">{title}</span>
				</div>
				<div className="flex gap-3">
					<Button
						onClick={() => navigate(`/edit/${wordPackId}`)}
						className={classNames("flex gap-2", styles.editBtn)}
						variant={"outline"}
					>
						<span>Edit</span>
						<FilePenLine />
					</Button>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant={"destructive"}
								className={classNames("flex gap-2", styles.editBtn)}
							>
								Delete
								<Trash />
							</Button>
						</DialogTrigger>
						<DialogContent className={styles.dialogContainer}>
							<DialogHeader className="gap-2">
								<DialogTitle>Are you absolutely sure?</DialogTitle>
								<DialogDescription>
									When you delete a pack, all the words in it will also be
									deleted.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className="gap-3">
								<DialogClose asChild>
									<Button disabled={deleteMutation.isPending}>Close</Button>
								</DialogClose>
								<Button
									variant={"destructive"}
									onClick={() =>
										deleteMutation.mutate(wordPackId ? +wordPackId : -1)
									}
									disabled={deleteMutation.isPending}
								>
									Delete {deleteMutation.isPending && <LoadingSpinner />}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<div
				className={classNames(
					styles.contentArea,
					"h-full flex justify-start items-center flex-col gap-4"
				)}
			>
				{index < wordDetails.length || nextIndex < wordDetails.length ? (
					<Card
						card1FaceRef={card1FaceRef}
						card1Ref={card1Ref}
						card2FaceRef={card2FaceRef}
						card2Ref={card2Ref}
						index={index}
						nextIndex={nextIndex}
						showFirst={showFirst}
						wordDetails={wordDetails}
						startQuiz={startQuiz}
					/>
				) : (
					<div className="h-full w-full justify-center items-center flex">
						<p>All caught up</p>
					</div>
				)}
				{!startQuiz && (
					<div className="flex justify-around w-full">
						<Toggle
							className="p-8"
							variant={"outline"}
							onClick={shuffleWordDetails}
						>
							<Shuffle size={32} />
						</Toggle>
						<Button
							className="p-8"
							variant={"outline"}
							onClick={() => setStartQuiz(true)}
							size={"lg"}
						>
							<Play size={32} />
						</Button>
					</div>
				)}
				{startQuiz &&
					(index < wordDetails.length || nextIndex < wordDetails.length) && (
						<div className="flex justify-around w-full">
							<Button
								onClick={() => handleNext(false)}
								variant={"outline"}
								className="p-8"
								size={"lg"}
							>
								<CircleX color="red" size={45} />
							</Button>
							<Button
								onClick={() => handleNext(true)}
								variant={"outline"}
								className="p-8"
								size={"lg"}
							>
								<Check color="green" size={45} />
							</Button>
						</div>
					)}
			</div>
		</div>
	);
};

export default Quiz;
