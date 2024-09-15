import { Error, NetResponse } from "@/types/common";
import { CreateWordPackReq, WordPack, WordPackDetails } from "@/types/wordPack";

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
export const getWordPackDetails = async (wordPackId: number) => {
	try {
		const url = `${
			import.meta.env.VITE_BACKEND
		}/WordPack/wordPack/${wordPackId}`;
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
				data: data as WordPack,
				res: res,
				status: true,
			} satisfies NetResponse<WordPack>;
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
export const updateWordPack = async (
	wordPack: CreateWordPackReq,
	wordPackId: number
) => {
	try {
		const url = `${
			import.meta.env.VITE_BACKEND
		}/WordPack/wordPack/${wordPackId}/edit`;
		const res = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(wordPack),
		});
		const data = await res.json();
		if (res.ok) {
			return {
				data: data as WordPack,
				res: res,
				status: true,
			} satisfies NetResponse<WordPack>;
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
export const deleteWordPack = async (wordPackId: number) => {
	try {
		const url = `${
			import.meta.env.VITE_BACKEND
		}/WordPack/wordPack/${wordPackId}/delete`;
		const res = await fetch(url, {
			method: "DELETE",
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
		return {
			data: data as Error,
			res: res,
			status: false,
		} satisfies NetResponse<Error>;
	} catch (e) {
		throw e;
	}
};
export const createWordPack = async (wordPack: CreateWordPackReq) => {
	try {
		const url = `${import.meta.env.VITE_BACKEND}/WordPack/create`;
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(wordPack),
		});
		const data = await res.json();
		if (res.ok) {
			return {
				data: data as WordPack,
				res: res,
				status: true,
			} satisfies NetResponse<WordPack>;
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
export const getPublicPacks = async () => {
	try {
		const url = `${import.meta.env.VITE_BACKEND}/WordPack/public`;
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
export const cloneWordPack = async (wordPackId: number) => {
	try {
		const url = `${import.meta.env.VITE_BACKEND}/WordPack/clone/${wordPackId}`;
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
		});
		const data = await res.json();
		if (res.ok) {
			return {
				data: data as number,
				res: res,
				status: true,
			} satisfies NetResponse<number>;
		}
		return {
			data: data.data,
			res: res,
			status: false,
		} satisfies NetResponse<Error>;
	} catch (e) {
		throw e;
	}
};
