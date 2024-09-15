export const wordPackDetailsKey = (wordPackId: string | undefined) => {
	return ["WordPack", wordPackId];
};

export const authKey = () => {
	return ["auth", "login"];
};
export const publicWordPackKey = () => {
	return ["WordPack", "public"];
};
export const userWordPackKey = () => {
	return ["WordPack", "user"];
};
