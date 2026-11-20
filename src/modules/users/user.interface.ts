export interface IUser {
    name: string,
    email: string,
    password: string,
    age?: number | null
}

export type PartialUser = Partial<IUser> & {
    is_Active?: boolean;
};