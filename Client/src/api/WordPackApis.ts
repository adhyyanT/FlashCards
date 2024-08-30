import { Error, NetResponse } from "@/types/common";
import { WordPack, WordPackDetails } from "@/types/wordPack";

export const getUserWordPacks = async () => {
	try {
		const url = `${import.meta.env.VITE_BACKEND}/WordPack/user`;
		const res = await fetch(url, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
		});
		const data = await res.json();
		if (res.ok) {
			return {
				data: data as WordPack[],
				res: res,
				status: true,
			} satisfies NetResponse<WordPack[]>;
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
export const getWordDetails = async (wordPackId: number) => {
	try {
		const url = `${import.meta.env.VITE_BACKEND}/WordPack/${wordPackId}/words`;
		const res = await fetch(url, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
		});
		const data = await res.json();
		if (res.ok) {
			return {
				data: data as WordPackDetails[],
				res: res,
				status: true,
			} satisfies NetResponse<WordPackDetails[]>;
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
