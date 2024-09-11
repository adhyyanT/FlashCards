export type WordPack = {
	wordPackId: number;
	name: string;
	isPublic: boolean;
	wordPackDetails: WordPackDetails[];
	user: string;
};
export type WordPackDetails = {
	wordId: number;
	word: string;
	meaning: string;
	image: string;
	proficiency: number;
};

export type CreateWordPackReq = {
	name: string;
	isPublic: boolean;
	wordPackDetails?: {
		word: string;
		meaning: string;
		image?: string;
		proficiency?: number;
	}[];
};
