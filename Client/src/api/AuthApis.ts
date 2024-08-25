import { Auth, RegisterRequest } from "@/types/AuthTypes";
import { NetResponse, Error } from "@/types/common";

export const login = async (email: string, password: string) => {
	try {
		const url = `${import.meta.env.VITE_BACKEND}/auth/login`;
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				email: email,
				password: password,
			}),
		});

		const data = await res.json();
		if (res.ok) {
			return { data: data, res: res } as NetResponse<Auth>;
		}
		return { data: data, res: res } as NetResponse<Error>;
	} catch (e) {
		throw e;
	}
};

export const register = async (registrationForm: RegisterRequest) => {
	try {
		const url = `${import.meta.env.VITE_BACKEND}/auth/register`;
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				...registrationForm,
			}),
		});

		const data = await res.json();
		if (res.ok) {
			return { data: data, res: res } as NetResponse<RegisterRequest>;
		}
		return { data: data, res: res } as NetResponse<Error>;
	} catch (e) {
		throw e;
	}
};
