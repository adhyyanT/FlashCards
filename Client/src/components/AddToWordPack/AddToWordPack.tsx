import { cloneWordPack } from "@/api/WordPackApis";
import {
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { AuthDialog } from "../AuthDialog/AuthDialog";
import { useTheme } from "../theme-provider";
import styles from "./AddToWordPack.module.css";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../Shared/Spinner/LoadingSpinner";

type AddToWordPackProps = {
	title: string;
	createdBy: string;
	colorClass: string;
	wordPackId: number;
};

const AddToWordPack = ({
	title,
	createdBy,
	colorClass,
	wordPackId,
}: AddToWordPackProps) => {
	const { theme } = useTheme();
	const { isLoggedIn } = useAuth();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const auth = useAuth();

	const { isPending, mutate } = useMutation({
		mutationFn: cloneWordPack,
		onSuccess: (res) => {
			console.log(res);
			if (res.status) {
				queryClient.invalidateQueries({ queryKey: ["WordPack", "user"] });
				navigate("/home");
			}
		},
		onError: (res) => {
			console.log(res);
		},
	});

	function handleAddToLib(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) {
		event.preventDefault();
		if (auth.isLoggedIn) mutate(wordPackId);
	}
	return (
		<DialogContent className={styles.dialog}>
			<DialogTitle className="py-4">
				<p className="flex justify-center">{title}</p>
			</DialogTitle>
			<DialogHeader>
				<div className={styles.dialogContainer}>
					<div className={classNames(styles.cardContainer, styles[colorClass])}>
						<p style={{ backfaceVisibility: "hidden" }}>{title}</p>
					</div>
					<div className={styles.btnContainer}>
						<p className={styles.author}>Author: {createdBy}</p>
					</div>
					<div className="flex flex-col gap-4 w-[300px]">
						{isLoggedIn ? (
							<DialogClose asChild onClick={(e) => handleAddToLib(e)}>
								<button
									disabled={isPending}
									className={classNames(
										styles.dialogBtn,
										theme === "dark"
											? "bg-background text-foreground"
											: "bg-foreground text-background"
									)}
								></button>
							</DialogClose>
						) : (
							<AuthDialog />
						)}
						<DialogClose asChild>
							<button
								className={classNames(
									styles.closeBtn,
									theme === "dark"
										? "bg-foreground text-background"
										: "bg-background text-foreground"
								)}
							>
								Close
							</button>
						</DialogClose>
					</div>
				</div>
			</DialogHeader>
		</DialogContent>
	);
};

export default AddToWordPack;
