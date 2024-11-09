import { Component, OnInit, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from '../account/account.service';
import { MemberService } from '../members/member.service';
import { CallMessage } from './CallMessage';
import { Router } from '@angular/router';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { NotificationService } from './Notification.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  private stompClient: any;
  public privateChats$ = new BehaviorSubject<Map<string, any[]>>(new Map());
  public users$ = new BehaviorSubject<any[]>([]);
  public message: string = '';
  public recipient: string = '';
  public newMessagesMap$ = new BehaviorSubject<Map<string, boolean>>(new Map());
  avatarMap = new Map<string, string>(); // Map lưu trữ ảnh đại diện theo username
  public unreadMessageCount: number = 0;


  public isEditing: boolean = false;
  public editingMessageId: string | null = null;
  public editingMessageContent: string = '';

  showOptionsMenu: string | null = null;

  public incomingCall: CallMessage | null = null;
  public showCallNotification: boolean = false;
  public roomID: string = '';

  private audio: HTMLAudioElement;
  private audioMessage: HTMLAudioElement;



  constructor(
    public userService: AccountService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private messageService: MemberService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService, // Thêm dòng này
  ) {
    this.audio = new Audio('/assets/sounds/incoming-call.mp3');
    this.audioMessage = new Audio('/assets/sounds/audio-message.mp3');
  }

  ngOnInit(): void {
    let userData = this.userService.getUserData();

    if (!userData || !userData.username) {
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
            userData = JSON.parse(savedUserData);
            this.userService.setUserData(userData);
        }
    }

    if (userData && userData.username) {
        this.loadMessagesFromLocalStorage();
        this.connect();

        const recipientName = this.messageService.getRecipientName();
        if (recipientName) {
            this.handleReceiverName(recipientName);
        }

        setInterval(() => this.checkWebSocketConnection(), 5000);
        this.fetchPreviousMessages(userData.username);
    }
    this.loadAvatars();
    this.newMessagesMap$.subscribe(newMessagesMap => {
      this.unreadMessageCount = Array.from(newMessagesMap.values()).filter(value => value === true).length;
      this.notificationService.updateUnreadCount(this.unreadMessageCount); // Cập nhật NotificationService
    });
  }
  loadAvatars(): void {
    this.privateChats$.subscribe(privateChats => {
      Array.from(privateChats.keys()).forEach(username => {
        // Chỉ gọi API nếu avatar của user chưa tồn tại trong avatarMap
        if (!this.avatarMap.has(username)) {
          this.http.get(`http://localhost:8080/api/v1/users/${username}/avatar`, { responseType: 'text' })
            .subscribe(
              avatarUrl => {
                // Nếu API trả về ảnh, lưu vào avatarMap, nếu không thì dùng ảnh mặc định
                this.avatarMap.set(username, avatarUrl || 'assets/avatar.png');
              },
              error => {
                console.error(`Error fetching avatar for ${username}`, error);
                // Nếu có lỗi, gán ảnh mặc định
                this.avatarMap.set(username, 'assets/avatar.png');
              }
            );
        }
      });
    });
  }



  private checkWebSocketConnection() {
    if (!this.stompClient || !this.stompClient.connected) {
        this.connect();
    } else {
        const userData = this.userService.getUserData();
        if (userData && userData.username) {
            this.fetchPreviousMessages(userData.username);
        }
    }
  }

  fetchPreviousMessages(username: string) {
    this.http.get<any[]>(`http://localhost:8080/messages/user/${username}`).subscribe({
        next: (messages) => {
            if (messages && messages.length > 0) {
                const currentChats = new Map<string, any[]>();

                messages.sort((a, b) => a.id - b.id);

                messages.forEach((message) => {
                    const chatPartner = message.senderName === username ?
                        message.receiverName : message.senderName;

                    if (!currentChats.has(chatPartner)) {
                        currentChats.set(chatPartner, []);
                    }
                    currentChats.get(chatPartner)!.push(message);
                });

                this.privateChats$.next(currentChats);
                this.localStorageService.setMessages(username, messages);
                this.cdr.detectChanges();
            }
        },
        error: (error) => {
            this.loadMessagesFromLocalStorage();
        }
    });
  }


  loadMessagesFromLocalStorage() {
    const username = this.userService.getUserData().username;
    const messages = this.localStorageService.getMessages(username);

    if (messages && messages.length > 0) {
        const currentChats = new Map<string, any[]>();

        messages.forEach((message) => {
            const chatPartner = message.senderName === username ?
                message.receiverName : message.senderName;

            if (!currentChats.has(chatPartner)) {
                currentChats.set(chatPartner, []);
            }
            currentChats.get(chatPartner)!.push(message);
        });

        this.privateChats$.next(currentChats);
        this.cdr.detectChanges();
    }
  }

  fetchLatestMessages(username: string) {
    this.http.get<any>(`http://localhost:8080/messages/user/last/${username}`).subscribe((latestMessage) => {
      if (latestMessage.receiverName && latestMessage.senderName) {
        const chatPartner = latestMessage.senderName === username ? latestMessage.receiverName : latestMessage.senderName;
        const currentChats = this.privateChats$.value;

        if (currentChats.has(chatPartner)) {
          const messages = currentChats.get(chatPartner)!;
          const isMessageExist = messages.some(msg => msg.id === latestMessage.id);

          if (!isMessageExist) {
            messages.push(latestMessage);
            this.privateChats$.next(new Map(currentChats));
          }
        } else {
          this.addMessageToPrivateChats(chatPartner, latestMessage);
        }

        this.cdr.markForCheck();
      }
    });
  }

  sendPrivateValue() {
    const userData = this.userService.getUserData();
    if (this.message.trim() !== '' && this.recipient !== '') {
      const chatMessage = {
        senderName: userData.username,
        receiverName: this.recipient,
        message: this.message,
        status: 'MESSAGE',
      };

      this.stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
      this.message = '';
      
      // Remove the setTimeout and call fetchLatestMessages and scrollToBottom together
      this.fetchLatestMessages(userData.username);
      // Add small delay to ensure DOM is updated before scrolling
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
  }


  addMessageToPrivateChats(senderOrReceiver: string, message: any) {
    this.ngZone.run(() => {
        const currentChats = new Map(this.privateChats$.value);
        if (!currentChats.has(senderOrReceiver)) {
            currentChats.set(senderOrReceiver, []);
        }

        const existingMessages = currentChats.get(senderOrReceiver)!;
        const messageExists = existingMessages.some(m => m.id === message.id);

        if (!messageExists) {
            existingMessages.push(message);
            currentChats.set(senderOrReceiver, existingMessages);
            this.privateChats$.next(currentChats);

            const username = this.userService.getUserData().username;
            const allMessages: any[] = [];
            currentChats.forEach(messages => {
                allMessages.push(...messages);
            });
            this.localStorageService.setMessages(username, allMessages);

            this.cdr.detectChanges();
        }
    });
  }

  connect() {
    try {
        const userData = this.userService.getUserData();
        if (!userData || !userData.username) {
            return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = over(socket);

        this.stompClient.connect(
            {},
            () => {
                if (userData && userData.username) {
                    this.userService.setUserData({ ...userData, connected: true });
                    this.stompClient.subscribe(
                        '/user/' + userData.username + '/private',
                        this.onPrivateMessage.bind(this),
                        { id: userData.username }
                    );
                    this.userJoin();
                }
            },
            (error: any) => {
                setTimeout(() => this.connect(), 5000);
            }
        );
    } catch (error) {
        console.error("Error during WebSocket connection setup:", error);
    }
  }

  private loadMessagesAfterConnection(username: string) {
    this.loadMessagesFromLocalStorage();
    this.fetchPreviousMessages(username);
  }

  userJoin() {
    const userData = this.userService.getUserData();
    if (this.stompClient) {
      const chatMessage = {
        senderName: userData.username,
        status: 'JOIN',
      };
      this.stompClient.send('/app/join', {}, JSON.stringify(chatMessage));
    }
  }

  onPrivateMessage(payload: any) {
    this.ngZone.run(() => {
        const payloadData = JSON.parse(payload.body);
        const userData = this.userService.getUserData();
        const chatPartner = payloadData.senderName === userData.username ?
            payloadData.receiverName : payloadData.senderName;

        if (payloadData.status !== 'CALL' && payloadData.id) {
            this.addMessageToPrivateChats(chatPartner, payloadData);
            this.scrollToBottom();

            if (this.recipient === chatPartner) {
                const currentNewMessagesMap = this.newMessagesMap$.value;
                currentNewMessagesMap.set(chatPartner, false);
                this.newMessagesMap$.next(new Map(currentNewMessagesMap));
            } else {
                const currentNewMessagesMap = this.newMessagesMap$.value;
                currentNewMessagesMap.set(chatPartner, true);
                this.newMessagesMap$.next(new Map(currentNewMessagesMap));
                this.playIncomingMessageSound();
            }
        }
        else if (payloadData.status === 'CALL') {
            this.roomID = payloadData.roomId;
            this.incomingCall = payloadData;
            this.showCallNotification = true;
            this.playIncomingCallSound();
        }
    });
  }

  playIncomingMessageSound() {
    if (this.audioMessage.paused) {
      this.audioMessage.play();
    }
  }

  pauseIncomingMessageSound() {
    if (!this.audioMessage.paused) {
      this.audioMessage.pause();
    }
  }

  playIncomingCallSound() {
    if (this.audio.paused) {
      this.audio.play();
    }
  }

  pauseIncomingCallSound() {
    if (!this.audio.paused) {
      this.audio.pause();
    }
  }


  onError(err: any) {
    console.log(err);
  }

  handleMessage(event: any) {
    this.message = event.target.value;
  }

  startEditMessage(messageId: string, content: string) {
    this.isEditing = true;
    this.editingMessageId = messageId;
    this.editingMessageContent = content;
    this.showOptionsMenu = null;
  }

  saveEditedMessage() {
    if (this.editingMessageId && this.editingMessageContent.trim() !== '') {
      const chatMessage = {
        id: this.editingMessageId,
        message: this.editingMessageContent,
        status: 'MESSAGE',
        receiverName: this.recipient
      };

      if (this.stompClient) {
        this.stompClient.send('/app/edit-message', {}, JSON.stringify(chatMessage));
        this.resetEditingState();
      }
    }
  }

  private updatePrivateMessage(response: any, updatedMessage: string, userData: any) {
    const chatPartner = response.senderName === userData.username ? response.receiverName : response.senderName;
    const privateChats = new Map(this.privateChats$.value);
    const updatedChat = privateChats.get(chatPartner)?.map(msg => {
      if (msg.id === response.id) {
        return { ...msg, message: updatedMessage, edited: true };
      }
      return msg;
    });

    if (updatedChat) {
      privateChats.set(chatPartner, updatedChat);
      this.privateChats$.next(new Map(privateChats));
    }
  }

  cancelEditMessage() {
    this.resetEditingState();
  }

  private resetEditingState() {
    this.isEditing = false;
    this.editingMessageId = null;
    this.editingMessageContent = '';
  }

  deleteMessage(messageId: string) {
    if (this.stompClient) {
      this.stompClient.send('/app/delete-message', {}, JSON.stringify(messageId));
      this.removeMessageFromView(messageId);
    }
  }

  removeMessageFromView(messageId: string) {
    const updatedPrivateChats = new Map(this.privateChats$.value);
    updatedPrivateChats.forEach((messages, user) => {
      const filteredMessages = messages.filter(msg => msg.id !== messageId);
      updatedPrivateChats.set(user, filteredMessages);
    });
    this.privateChats$.next(updatedPrivateChats);
  }

  handleReceiverName(username: string) {
    this.recipient = username;
    this.messageService.setRecipientName(username);

    const currentNewMessagesMap = this.newMessagesMap$.value;
    currentNewMessagesMap.set(username, false);
    this.newMessagesMap$.next(new Map(currentNewMessagesMap));

    setTimeout(() => this.scrollToBottom(), 100);
  }

  toggleOptionsMenu(messageId: string, event: Event) {
    event.stopPropagation();
    this.showOptionsMenu = this.showOptionsMenu === messageId ? null : messageId;
  }

  closeAllOptionsMenus() {
    this.showOptionsMenu = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeAllOptionsMenus();
  }

  extractNewMessage(message: string): string {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage && parsedMessage.newMessage) {
        return parsedMessage.newMessage;
      }
    } catch (error) {
      return message;
    }
    return message;
  }

  private scrollToBottom() {
    try {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        // Use smooth scrolling for better user experience
        chatMessages.scrollTo({
          top: chatMessages.scrollHeight,
          behavior: 'smooth'
        });
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  randomID(len: number): string {
    const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
    return Array.from({ length: len }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }
  initiateCall(type: 'phone' | 'video') {
    if (!this.recipient) {
      console.warn('Please select a recipient for the call');
      return;
    }
    this.roomID = this.randomID(5);
    this.sendMessage();
    this.router.navigate(['/callvideo'], { queryParams: { roomID: this.roomID } });
  }

  sendMessage() {
    if (!this.stompClient || !this.stompClient.connected) {
      console.warn('STOMP client is not connected.');
      return;
    }

    const userData = this.userService.getUserData();
    const chatMessage = {
      senderName: userData.username,
      receiverName: this.recipient,
      roomId: this.roomID,
      status: 'CALL',
    };

    this.stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
    console.log("Call notification sent.", chatMessage);
  }
  acceptCall() {
    // Dừng và reset âm thanh
    this.audio.pause();
    this.audio.currentTime = 0;

    this.showCallNotification = false;
    this.router.navigate(['/callvideo'], { queryParams: { roomID: this.roomID } });
  }

  // Thêm một phương thức để từ chối cuộc gọi
  declineCall() {
    // Dừng và reset âm thanh
    this.audio.pause();
    this.audio.currentTime = 0;

    this.showCallNotification = false;
    this.incomingCall = null;
  }


}

