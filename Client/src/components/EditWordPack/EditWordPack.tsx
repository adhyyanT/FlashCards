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
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import styles from "./EditWordPack.module.css";

const wordPackDetails = z.object({
	word: z.string().min(2).max(15),
	meaning: z.string().min(4).max(1000),
	proficiency: z.number().optional(),
	image: z.string().optional(),
});

const wordPackSchema = z.object({
	name: z.string().min(4).max(15),
	isPublic: z.boolean().default(false),
	wordPackDetails: z.array(wordPackDetails).optional(),
});

const EditWordPack = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	const wordPackForm = useForm<z.infer<typeof wordPackSchema>>({
		resolver: zodResolver(wordPackSchema),
		defaultValues: {
			name: "",
			isPublic: false,
			wordPackDetails: [{ image: "", meaning: "", proficiency: 0, word: "" }],
		},
	});

	function onSubmit(values: z.infer<typeof wordPackSchema>) {
		console.log(values);
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

	return (
		<div className={styles.homeHeader}>
			<div className={styles.header}>
				<div className="flex gap-2 items-end">
					<Plus size={32} />
					<span className={styles.headerTitle}>Create word pack</span>
				</div>
				<Button
					disabled={!wordPackForm.formState.isValid}
					form="wordPack"
					type="submit"
				>
					Create
				</Button>
			</div>
			<div className={classNames(styles.contentArea)}>
				<Form {...wordPackForm}>
					<form
						className={classNames("space-y-6", styles.form)}
						onSubmit={wordPackForm.handleSubmit(onSubmit)}
						id="wordPack"
					>
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
