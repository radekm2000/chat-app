
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

export type FindUserParams = {
    id?: number
}

export type CreateConversationParams = {
    username: string;
    message?: string;
}

export type OnlineUser = {
    userId: number;
    socketId: string;
}

export type Notification = {
    isRead: boolean,
    date: Date,
    senderId: number
}