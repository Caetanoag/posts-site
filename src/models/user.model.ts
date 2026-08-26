export interface User {
	id: number;
	name: string;
	email: string;
	password: string; // hash
}

export interface CreateUserInput {
	name: string;
	email: string;
	password: string;
}

export interface LoginInput {
	email: string;
	password: string;
}
