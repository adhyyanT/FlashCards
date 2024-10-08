import {
	createWordPack,
	getWordPackDetails,
	updateWordPack,
} from "@/api/WordPackApis";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthProvider";
import {
	publicWordPackKey,
	userWordPackKey,
	wordPackDetailsKey,
} from "@/utils/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { FilePenLine, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import styles from "./EditWordPack.module.css";
import { WordPack } from "@/types/wordPack";
import Loading from "../Shared/Loading/Loading";

const wordPackDetails = z.object({
	word: z
		.string()
		.min(2, {
			message: "Word should have at least 2 characters",
		})
		.max(15, {
			message: "Word should be under 15 characters",
		}),
	meaning: z
		.string()
		.min(4, {
			message: "Meaning should have at least 4 characters",
		})
		.max(1000, {
			message: "Meaning should be under 1000 characters",
		}),
	proficiency: z.number().optional(),
	image: z.string().optional(),
});

const wordPackSchema = z.object({
	name: z
		.string()
		.min(4, {
			message: "Title should have at least 4 characters.",
		})
		.max(35, {
			message: "Title should have 35 characters.",
		}),
	isPublic: z.boolean().default(false),
	wordPackDetails: z.array(wordPackDetails).optional(),
});

const EditWordPack = () => {
	const auth = useAuth();
	const navigate = useNavigate();
	const { wordPackId } = useParams();
	const queryClient = useQueryClient();

	const createWordPackMutation = useMutation({
		mutationFn: createWordPack,
		onSuccess: (res) => {
			navigate("/home");
			queryClient.invalidateQueries({
				queryKey: userWordPackKey(),
			});
			if (res.status && res.data.isPublic) {
				queryClient.invalidateQueries({
					queryKey: publicWordPackKey(),
				});
			}
		},
		onError: (e) => {
			console.log("err", e);
		},
	});
	const updateWordPackMutation = useMutation({
		mutationFn: ({
			wordPack,
			wordPackId,
		}: {
			wordPack: WordPack;
			wordPackId: number;
		}) => {
			return updateWordPack(wordPack, wordPackId);
		},
		onSuccess: (res) => {
			queryClient.invalidateQueries({
				queryKey: userWordPackKey(),
			});
			queryClient.invalidateQueries({
				queryKey: wordPackDetailsKey(wordPackId),
			});
			if (res.status && res.data.isPublic) {
				queryClient.invalidateQueries({
					queryKey: publicWordPackKey(),
				});
			}
			navigate(-1);
		},
	});

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
		enabled: auth.isLoggedIn && wordPackId !== undefined,
		staleTime: Infinity,
	});

	const defaultFormValue = useMemo(() => {
		const t = {
			name: "",
			isPublic: false,
			wordPackDetails: [{ image: "", meaning: "", proficiency: 0, word: "" }],
		};
		if (data && data.status) {
			t.wordPackDetails = data.data.wordPackDetails;
			t.name = data.data.name;
			t.isPublic = data.data.isPublic;
		}
		return t;
	}, [data]);

	const wordPackForm = useForm<z.infer<typeof wordPackSchema>>({
		resolver: zodResolver(wordPackSchema),
		defaultValues: defaultFormValue,
	});

	function onCreate(values: z.infer<typeof wordPackSchema>) {
		createWordPackMutation.mutate(values);
	}
	function onUpdate(values: z.infer<typeof wordPackSchema>) {
		if (data && data.status)
			updateWordPackMutation.mutate({
				wordPack: values as WordPack,
				wordPackId: data.data.wordPackId,
			});
	}
	const wordDetailFields = useFieldArray({
		name: "wordPackDetails",
		control: wordPackForm.control,
	});

	useEffect(() => {
		if (!auth.isLoggedIn) {
			navigate("/home");
		}
	}, [auth.user]);

	const addWordDetailEntry = () => {
		wordDetailFields.append({
			meaning: "",
			word: "",
			image: "",
			proficiency: 0,
		});
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className={styles.homeHeader}>
			<div className={styles.header}>
				{wordPackId ? (
					<>
						<div className="flex gap-2 items-end">
							<FilePenLine size={32} />
							<span className={styles.headerTitle}>
								Edit {data && data.status ? data.data.name : ""}
							</span>
						</div>
						<Button
							onClick={wordPackForm.handleSubmit(onUpdate)}
							form="wordPack"
						>
							Save
						</Button>
					</>
				) : (
					<>
						<div className="flex gap-2 items-end">
							<Plus size={32} />
							<span className={styles.headerTitle}>Create word pack</span>
						</div>
						<Button
							form="wordPack"
							onClick={wordPackForm.handleSubmit(onCreate)}
						>
							Create
						</Button>
					</>
				)}
			</div>
			<div className={classNames(styles.contentArea)}>
				<Form {...wordPackForm}>
					<form className={classNames("space-y-6", styles.form)} id="wordPack">
						<FormField
							control={wordPackForm.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={wordPackForm.control}
							name="isPublic"
							render={({ field }) => {
								return (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Public</FormLabel>
											<FormDescription>
												Checking this will help others view your word pack.
											</FormDescription>
										</div>
									</FormItem>
								);
							}}
						/>
					</form>
					<div className="pt-8 flex flex-col gap-8">
						{wordDetailFields.fields.map((test, index) => {
							return (
								<div
									key={test.id}
									className={classNames("flex flex-col gap-1")}
								>
									<div className={styles.wordHeader}>
										<p>{index + 1}</p>{" "}
										<div>
											<Button
												disabled={wordDetailFields.fields.length <= 1}
												onClick={() => wordDetailFields.remove(index)}
												variant={"link"}
											>
												<Trash2 color="#ad5b5b" size={30} />
											</Button>
										</div>
									</div>
									<div
										className={classNames(
											"flex w-full justify-center items-start gap-4",
											styles.wordContent
										)}
									>
										<FormField
											control={wordPackForm.control}
											name={`wordPackDetails.${index}.word`}
											render={({ field }) => (
												<FormItem className="w-full">
													<FormLabel>Word</FormLabel>
													<FormControl>
														<Input placeholder="title" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={wordPackForm.control}
											name={`wordPackDetails.${index}.meaning`}
											render={({ field }) => (
												<FormItem className="w-full">
													<FormLabel>Meaning</FormLabel>
													<FormControl>
														<Textarea placeholder="title" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							);
						})}
						<button
							onClick={addWordDetailEntry}
							className={classNames(styles.addCard)}
						>
							<div className="flex gap-2">
								<Plus /> <span>ADD CARD</span>
							</div>
						</button>
					</div>
				</Form>
			</div>
		</div>
	);
};

export default EditWordPack;
