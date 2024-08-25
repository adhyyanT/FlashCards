import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

import { login, register } from "@/api/AuthApis";
import { hasError } from "@/utils/checkError";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthProvider";
import { Gender } from "@/types/gender";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../Shared/Spinner/LoadingSpinner";
import styles from "./AuthDialog.module.css";
import { RegisterRequest } from "@/types/AuthTypes";

const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
});

const registerFormSchema = z
	.object({
		firstName: z.string().trim().toLowerCase().min(1),
		lastName: z.string().trim().toLowerCase().min(1),
		email: z.string().email(),
		password: z.string().min(4),
		confirmPassword: z.string().min(4),
	})
	.superRefine((refine, ctx) => {
		if (refine.confirmPassword !== refine.password) {
			ctx.addIssue({
				code: "custom",
				message: "The passwords do not match",
				path: ["confirmPassword"],
			});
		}
	});

export const AuthDialog = () => {
	const auth = useAuth();
	const [initialRender, setInitialRender] = useState(true);

	// const queryClient = useQueryClient();
	const loginMutation = useMutation({
		mutationFn: (credentials: z.infer<typeof loginFormSchema>) => {
			return login(credentials.email, credentials.password);
		},
		onSuccess: (response) => {
			const { data } = response;
			if (!hasError(data)) {
				auth.setUser({
					isLoggedIn: true,
					user: data,
				});
			} else {
				if (!initialRender) {
					loginForm.setError("email", { message: data.error });
					loginForm.setError("password", { message: data.error });
				}
			}
			setInitialRender(false);
		},
		onError: (e) => {
			console.log(e);
		},
	});

	const registerMutation = useMutation({
		mutationFn: register,
		onSuccess: (response) => {
			const { data, res } = response;
			if (res.status >= 400 && res.status < 500) {
				console.log(data);
			}
		},
	});

	const loginForm = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const registerForm = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			confirmPassword: "",
			email: "",
			firstName: "",
			lastName: "",
			password: "",
		},
	});

	useEffect(() => {
		if (!auth.user && initialRender) {
			loginMutation.mutate({ email: "local@local.com", password: "local" });
		}
	}, []);

	const handleLogin = (form: z.infer<typeof loginFormSchema>) => {
		loginMutation.mutate(form);
	};
	const handleRegister = (form: z.infer<typeof registerFormSchema>) => {
		console.log(form);
		registerMutation.mutate({
			...form,
			age: 0,
			gender: Gender.Male,
			avatar: "",
		} satisfies RegisterRequest);
	};
	return (
		<Dialog>
			<DialogTrigger className={styles.signInBtn}>Sign In</DialogTrigger>

			<DialogContent className={styles.dialogContainer}>
				<DialogTitle className="flex justify-center items-center gap-2">
					<Zap size={40} /> <span className="text-2xl">Cards</span>
				</DialogTitle>
				<Tabs defaultValue="login" className="w-full">
					<TabsList className="w-full">
						<TabsTrigger className="w-full" value="login">
							Login
						</TabsTrigger>
						<TabsTrigger className="w-full" value="register">
							Sign Up
						</TabsTrigger>
					</TabsList>
					<TabsContent value="login">
						<Form {...loginForm}>
							<form
								onSubmit={loginForm.handleSubmit(handleLogin)}
								className="space-y-8"
							>
								<FormField
									control={loginForm.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel color="white">Email</FormLabel>
											<FormControl>
												<Input placeholder="shadcn" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={loginForm.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="shadcn"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex justify-center">
									<Button
										className="w-full"
										disabled={loginMutation.isPending}
										type="submit"
									>
										Submit {loginMutation.isPending && <LoadingSpinner />}
									</Button>
								</div>
							</form>
						</Form>
					</TabsContent>
					<TabsContent value="register">
						<Form {...registerForm}>
							<form
								onSubmit={registerForm.handleSubmit(handleRegister)}
								className="space-y-8"
							>
								<div className="flex gap-3 w-full mt-4">
									<FormField
										control={registerForm.control}
										name="firstName"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel color="white">First Name</FormLabel>
												<FormControl>
													<Input placeholder="John" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={registerForm.control}
										name="lastName"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel color="white">Last Name</FormLabel>
												<FormControl>
													<Input placeholder="Doe" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={registerForm.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="test@email.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={registerForm.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={registerForm.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="confirm password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">Sign Up</Button>
							</form>
						</Form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};
