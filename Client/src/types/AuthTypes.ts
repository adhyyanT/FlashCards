export type Auth = {
	appUserId: number;
	firstName: string;
	lastName: string;
	email: string;
	gender: number;
	age: number;
	avatar: string;
	jwt: string;
};
export type RegisterRequest = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	gender: number;
	age: number;
	avatar?: string;
};
