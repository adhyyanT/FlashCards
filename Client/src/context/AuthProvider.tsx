import { Auth } from "@/types/AuthTypes";
import { createContext, useContext, useState } from "react";

type AuthProviderState = {
	user?: Auth;
	setUser: (user: { user?: Auth; isLoggedIn: boolean }) => void;
	isLoggedIn: boolean;
};

type AuthProviderProps = {
	children: React.ReactNode;
};
const initialState: AuthProviderState = {
	user: undefined,
	setUser: () => null,
	isLoggedIn: false,
};

const AuthProviderContext = createContext<AuthProviderState>(initialState);

const AuthProvider = ({ children, ...props }: AuthProviderProps) => {
	const [user, setUser] = useState<{ user?: Auth; isLoggedIn: boolean }>({
		isLoggedIn: false,
	});

	const value: AuthProviderState = {
		user: user.user,
		setUser: (val: { user?: Auth; isLoggedIn: boolean }) => {
			setUser(val);
		},
		isLoggedIn: user.isLoggedIn,
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
