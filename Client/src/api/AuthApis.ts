import { Auth, RegisterRequest } from "@/types/AuthTypes";
import { NetResponse, Error } from "@/types/common";

export const login = async (
	email: string,
	password: string,
	abortController: AbortController
) => {
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
			signal: abortController.signal,
		});

		const data = await res.json();
		if (res.ok) {
			return {
				data: data as Auth,
				res: res,
				status: true,
			} satisfies NetResponse<Auth>;
		}
		return {
			data: data as Error,
			res: res,
			status: false,
		} satisfies NetResponse<Error>;
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
			return {
				data: data as Auth,
				res: res,
				status: true,
			} satisfies NetResponse<Auth>;
		}
		return { data: data, res: res, status: false } satisfies NetResponse<Error>;
	} catch (e) {
		throw e;
	}
};
export const logout = async () => {
	try {
		const url = `${import.meta.env.VITE_BACKEND}/auth/logout`;
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
		});
		if (res.ok) {
			return {
				data: null,
				res: res,
				status: true,
			} satisfies NetResponse<null>;
		}
		const data = await res.json();
		return { data: data, res: res, status: false } satisfies NetResponse<Error>;
	} catch (e) {
		throw e;
	}
};
