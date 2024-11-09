import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Message } from '../shared/models/message/message.model';
import { ChatRoomDto } from '../shared/models/message/chat-room.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private apiUrl = `${environment.hubUrl}/api/chat`; // Cập nhật đường dẫn API cho phù hợp

  constructor(private http: HttpClient) {}

  // Lấy tất cả tin nhắn giữa hai người dùng
  findChatMessages(senderId: string, recipientId: string) {
    return this.http.get<Message[]>(`${this.apiUrl}/messages/${senderId}/${recipientId}`);
  }

  // Lấy tất cả tin nhắn chưa đọc của người nhận
  findUnreadMessages(recipientId: string) {
    return this.http.get<Message[]>(`${this.apiUrl}/messages/unread/${recipientId}`);
  }

  // Đánh dấu tin nhắn là đã đọc
  markMessageAsRead(messageId: number) {
    return this.http.put<void>(`${this.apiUrl}/messages/read/${messageId}`, {});
  }

  // Lấy hoặc tạo phòng chat giữa hai người dùng
  getOrCreateChatRoom(senderId: string, recipientId: string) {
    return this.http.get<ChatRoomDto>(`${this.apiUrl}/room/${senderId}/${recipientId}`);
  }

  // Tìm tất cả các phòng chat của người dùng
  findChatRoomsByUser(userId: string) {
    return this.http.get<ChatRoomDto[]>(`${this.apiUrl}/rooms/${userId}`);
  }
}
