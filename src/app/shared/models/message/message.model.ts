// export interface Message {
//     id: string
//     senderId: string
//     senderUsername: string
//     senderKnowAs: string;
//     senderPhotoUrl: string
//     recipientId: string
//     recipientUsername: string
//     recipientKnowAs: string;
//     recipientPhotoUrl: string
//     content: string
//     dateRead: Date
//     messageSent: Date
//   }

export interface Message {
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  status: string;
}
