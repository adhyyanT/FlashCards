import { login } from "@/api/AuthApis";
import { Auth } from "@/types/AuthTypes";
import { authKey } from "@/utils/queryKeys";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextState = {
	user?: Auth;
	setUser: (user: {
		user?: Auth;
		isLoggedIn: boolean;
		isLoading: boolean;
		fetchUser: boolean;
	}) => void;
	isLoggedIn: boolean;
	isLoading: boolean;
	fetchUser: boolean;
};
type AuthProviderState = {
	user?: Auth;
	isLoggedIn: boolean;
	isLoading: boolean;
	fetchUser: boolean;
};
type AuthProviderProps = {
	children: React.ReactNode;
};
const initialState: AuthProviderState = {
	user: undefined,
	isLoggedIn: false,
	isLoading: true,
	fetchUser: false,
};

const AuthProviderContext = createContext<AuthContextState>({
	...initialState,
	setUser: () => null,
});

const AuthProvider = ({ children, ...props }: AuthProviderProps) => {
	const [user, setUser] = useState<AuthProviderState>(initialState);
	const abort = new AbortController();

	const loginMutation = useMutation({
		mutationKey: authKey(),
		mutationFn: () => {
			return login("local@local.com", "local", abort);
		},
		onSuccess: (response) => {
			if (response.status) {
				setUser({
					isLoggedIn: true,
					user: response.data,
					isLoading: false,
					fetchUser: false,
				});
			} else {
				setUser({
					isLoggedIn: false,
					user: undefined,
					isLoading: false,
					fetchUser: false,
				});
			}
		},
		onError: (e) => {
			console.log(e);
		},
	});

	useEffect(() => {
		if (!user.isLoggedIn) {
			setUser({
				isLoggedIn: false,
				user: user.user,
				isLoading: true,
				fetchUser: false,
			});
			loginMutation.mutate();
		}
		return () => {
			abort.abort();
		};
	}, []);

	const value: AuthProviderState = {
		fetchUser: user.fetchUser,
		user: user.user,
		isLoggedIn: user.isLoggedIn,
		isLoading: user.isLoading,
	};
	return (
		<AuthProviderContext.Provider
			{...props}
			value={{ ...value, setUser: setUser }}
		>
			{children}
		</AuthProviderContext.Provider>
	);
};

const useAuth = () => {
	const auth = useContext(AuthProviderContext);
	if (!auth) throw new Error("useAuth must be used within a AuthProvider");
	return auth;
};

export { AuthProvider, useAuth };
