
export type RegisterInput = {
    username: string;
    password: string;
}

export type LoginInput = {
    username: string;
    password: string;
}

export type User = {
    id: string,
    username: string
}

export type SearchBarResponse = {
    users: User[] | User | undefined
}