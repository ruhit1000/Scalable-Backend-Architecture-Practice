export interface IUser {
    name: string,
    email: string,
    password: string,
    age?: number | null,
    role?: string
}

export type PartialUser = Partial<IUser> & {
    is_Active?: boolean;
};