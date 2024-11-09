import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  setMessages(username: string, messages: any[]) {
    localStorage.setItem(`messages_${username}`, JSON.stringify(messages));
  }

  getMessages(username: string): any[] {
    const messages = localStorage.getItem(`messages_${username}`);
    return messages ? JSON.parse(messages) : [];
  }
}