import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { Message } from '../models/message';
import { environment } from '../../../environments/environment';
import { PresenceService } from './presence-service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private hubUrl = `${environment.hubUrl}/chat`;
  private hubConnection?: HubConnection;

  constructor() {}

  currentOpenedChat = signal<User | null>(null);
  chatMessages = signal<Message[]>([]);
  isLoading = signal<boolean>(false);
  autoScrollEnabled = signal<boolean>(true);
  pageNumber = signal<number>(1);
  isConnected = signal<boolean>(false);
  chatRightSidebarIsOpen = signal<boolean>(false);
  replyMessage = signal<Message | null>(null);
  presenceService = inject(PresenceService);

  startConnection(senderId?: string) {
    console.log("CHAT CONN");
    if (this.hubConnection?.state === HubConnectionState.Connected) return;

    if (this.hubConnection) {
      this.hubConnection.off('ReceiveNewMessage');
      this.hubConnection.off('ReceiveMessageList');
      this.hubConnection.off('NotifyTypingToUser');
      this.hubConnection.off('Notify');
    }
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?senderId=${senderId || ''}`, {
        accessTokenFactory: () => localStorage.getItem('token')!,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => this.isConnected.set(true))
      .catch((error) => console.error('Chat Hub Error: ', error));

    this.hubConnection!.on('NotifyTypingToUser', (senderUserName) => {
      this.presenceService.onlineUsers.update((users) =>
        users.map((user) => {
          if (user.userName === senderUserName) {
            return { ...user, isTyping: true };
          }
          return user;
        }),
      );

      setTimeout(() => {
        this.presenceService.onlineUsers.update((users) =>
          users.map((user) => {
            if (user.userName === senderUserName) {
              return { ...user, isTyping: false };
            }

            return user;
          }),
        );
      }, 5000);
    });

    this.hubConnection.on('ReceiveMessageList', (messages: Message[]) => {
      this.chatMessages.set(messages);
    });

    this.hubConnection.on('ReceiveNewMessage', (message: Message) => {
      const audio = new Audio('assets/notification.mp3');
      audio.play();

      const currentChat = this.currentOpenedChat();
      if (
        message.senderId === currentChat?.id ||
        message.receiverId === currentChat?.id
      ) {
        this.chatMessages.update((msgs) => [...msgs, message]);
      }
    });
  }

  stopConnection() {
    console.log("CHAT STOP");
    
    this.hubConnection?.stop().then(() => this.isConnected.set(false)).catch((err) => console.error(err));
  }

  loadMessages(pageNumber: number) {
    if (!this.currentOpenedChat()) return;

    this.isLoading.set(true);
    this.hubConnection
      ?.invoke('LoadMessages', this.currentOpenedChat()?.id, pageNumber)
      .finally(() => this.isLoading.set(false));
  }

  async sendMessageHub(messageContent: string, attachments: any[], senderId: string) {
    return this.hubConnection?.invoke('SendMessage', {
      receiverId: this.currentOpenedChat()?.id,
      senderId: senderId,
      content: messageContent,
      replyMessageId: this.replyMessage()?.id,
      attachments: attachments,
    });
  }

  notifyTyping() {
    this.hubConnection!.invoke(
      'NotifyTyping',
      this.currentOpenedChat()?.userName,
    );
  }
}
