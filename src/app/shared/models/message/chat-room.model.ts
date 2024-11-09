export interface ChatRoomDto {
    id: number;
    chatId: string;
    senderId: string;
    recipientId: string;
    lastMessageContent: string;
    lastMessageTimestamp: Date;
    lastMessageStatus: string;
}