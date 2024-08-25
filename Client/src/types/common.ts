export type Error = { error: string };

export type NetResponse<T> = {
	res: Response;
	data: T;
};
