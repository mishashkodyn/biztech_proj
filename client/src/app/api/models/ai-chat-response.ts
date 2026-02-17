export interface AiChatResponse{
    message: string;
    history: AiMessage[];
}

export interface AiMessage {
    role: string;
    content: string;
}