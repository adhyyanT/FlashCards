import classNames from "classnames";
import React from "react";
import styles from "./Card.module.css";
import { WordPackDetails } from "@/types/wordPack";

type CardProp = {
	card1Ref: React.RefObject<HTMLDivElement>;
	card2Ref: React.RefObject<HTMLDivElement>;
	showFirst: boolean;
	card1FaceRef: React.RefObject<HTMLDivElement>;
	card2FaceRef: React.RefObject<HTMLDivElement>;
	wordDetails: WordPackDetails[];
	index: number;
	nextIndex: number;
	startQuiz: boolean;
};

const Card = ({
	showFirst,
	card1Ref,
	card2Ref,
	card1FaceRef,
	card2FaceRef,
	wordDetails,
	index,
	nextIndex,
	startQuiz,
}: CardProp) => {
	const flipCard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (startQuiz) event.currentTarget.classList.toggle(styles.flipCard);
	};

	return (
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
	);
};

export default Card;
