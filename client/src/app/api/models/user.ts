export interface User {
    id: string;
    name: string;
    surname: string;
    profilePicture: string;
    profileImage: string;
    isOnline: boolean;
    userName: string;
    connectionId: string;
    lastMessage: string;
    unreadCount: number;
    isTyping: boolean;
}