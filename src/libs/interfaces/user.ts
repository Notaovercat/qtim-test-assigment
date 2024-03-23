export interface IUser {
	id: number;
	email: string;
	username: string;
	password: string;
	created_at: Date;
}

export interface ISignIn
	extends Omit<IUser, "id" | "username" | "created_at"> {}

export interface ISignUp extends Omit<IUser, "id" | "created_at"> {}
