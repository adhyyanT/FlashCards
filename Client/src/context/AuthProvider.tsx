import { Auth } from "@/types/AuthTypes";
import { createContext, useContext, useState } from "react";

type AuthProviderState = {
	user?: Auth;
	setUser: (user: {
		user?: Auth;
		isLoggedIn: boolean;
		isLoading: boolean;
	}) => void;
	isLoggedIn: boolean;
	isLoading: boolean;
};

type AuthProviderProps = {
	children: React.ReactNode;
};
const initialState: AuthProviderState = {
	user: undefined,
	setUser: () => null,
	isLoggedIn: false,
	isLoading: false,
};

const AuthProviderContext = createContext<AuthProviderState>(initialState);

const AuthProvider = ({ children, ...props }: AuthProviderProps) => {
	const [user, setUser] = useState<{
		user?: Auth;
		isLoggedIn: boolean;
		isLoading: boolean;
	}>({
		isLoggedIn: false,
		isLoading: false,
	});

	const value: AuthProviderState = {
		user: user.user,
		setUser: (val: {
			user?: Auth;
			isLoggedIn: boolean;
			isLoading: boolean;
		}) => {
			setUser(val);
		},
		isLoggedIn: user.isLoggedIn,
		isLoading: user.isLoading,
	};
	return (
		<AuthProviderContext.Provider {...props} value={value}>
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
