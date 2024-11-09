export interface CallMessage {
  senderName: string;
  receiverName: string;
  callType: 'video';
  status: string;
  roomID: string;
}
