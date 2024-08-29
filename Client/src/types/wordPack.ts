export type WordPack = {
	wordPackId: number;
	name: string;
	isPublic: boolean;
	wordPackDetails: WordPackDetails[];
};
export type WordPackDetails = {
	wordId: number;
	word: string;
	meaning: string;
	image: string;
	proficiency: number;
};
