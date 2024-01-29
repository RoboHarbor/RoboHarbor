
export type LoginDataDto = {
    email: string;
    password: string;
}

export type UserData = {
    id?: number;
    email?: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
};