import { Error } from "@/types/common";

export const hasError = (res: unknown | Error): res is Error => {
	return (
		(res as Error).error !== undefined || (res as any).errors !== undefined
	);
};
