import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private hubUrl = 'http://localhost:5000/hubs/chat';
  private hubConnection?: HubConnection;

  constructor(private authService: AuthService) {}

  onlineUsers = signal<User[]>([]);
  currentOpenedChat = signal<User | null>(null);
  chatMessages = signal<Message[]>([]);
  isLoading = signal<boolean>(false);
  autoScrollEnabled = signal<boolean>(true);
  pageNumber = signal<number>(1);
  isConnected = signal<boolean>(false);
  chatRightSidebarIsOpen = signal<boolean>(false);

  startConnection(token: string, senderId?: string) {
    if (this.hubConnection?.state === HubConnectionState.Connected) return;

    if (this.hubConnection) {
      this.hubConnection.off('ReceiveNewMessage');
      this.hubConnection.off('ReceiveMessageList');
      this.hubConnection.off('OnlineUsers');
      this.hubConnection.off('NotifyTypingToUser');
      this.hubConnection.off('Notify');
    }
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?senderId=${senderId || ''}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.isConnected.set(true);
      })
      .catch((error) => {
        console.log('Connection or login error.', error);
      });

    this.hubConnection!.on('Notify', (user: User) => {
      if (user.userName == this.authService.currentLoggedUser?.userName) return;

      Notification.requestPermission().then((result) => {
        if (result == 'granted') {
          new Notification('Active now 🟢', {
            body: user.name + ' ' + user.surname + ' is online now',
            icon: user.profileImage,
          });
        }
      });
    });

    this.hubConnection!.on('NotifyTypingToUser', (senderUserName) => {
      this.onlineUsers.update((users) =>
        users.map((user) => {
          if (user.userName === senderUserName) {
            user.isTyping = true;
          }

          return user;
        })
      );

      setTimeout(() => {
        this.onlineUsers.update((users) =>
          users.map((user) => {
            if (user.userName === senderUserName) {
              user.isTyping = false;
            }

            return user;
          })
        );
      }, 5000);
    });

    this.hubConnection!.on('OnlineUsers', (users: User[]) => {
      console.log(users);
      this.onlineUsers.update(() =>
        users.filter(
          (users) =>
            users.userName !== this.authService.currentLoggedUser?.userName
        )
      );
    });

    this.hubConnection!.on('ReceiveMessageList', (message: Message[]) => {
      this.isLoading.set(true);
      this.chatMessages.update((messages) => [...message, ...messages]);
      this.isLoading.set(false);
    });

    this.hubConnection!.on('ReceiveNewMessage', (message: Message) => {
      let audio = new Audio('assets/notification.mp3');
      audio.play();
      document.title = 'New Message';

      if (
        message.senderId === this.currentOpenedChat()?.id ||
        message.receiverId === this.currentOpenedChat()?.id
      ) {
        this.chatMessages.update((messages) => [...messages, message]);
      } else {
      }
    });
  }

  disconnectConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }

  status(username: string): string {
    const currentChatUser = this.currentOpenedChat();
    if (!currentChatUser) {
      return 'Offline';
    }

    const onlineUser = this.onlineUsers().find(
      (user) => user.userName === username
    );

    return onlineUser?.isTyping ? 'Typing...' : this.isUserOnline();
  }

  isUserOnline(): string {
    let onlineUser = this.onlineUsers().find(
      (user) => user.userName === this.currentOpenedChat()?.userName
    );
    return onlineUser?.isOnline ? 'online' : this.currentOpenedChat()!.userName;
  }

  loadMessages(pageNumber: number) {
    if (pageNumber === 1) {
      this.chatMessages.set([]);
    }

    this.pageNumber.set(pageNumber);
    this.isLoading.set(true);

    this.hubConnection
      ?.invoke('LoadMessages', this.currentOpenedChat()?.id, pageNumber)
      .catch((err) => console.error(err))
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  sendMessage(message: string) {
    this.chatMessages.update((messages) => [
      ...messages,
      {
        content: message,
        senderId: this.authService.currentLoggedUser!.id,
        receiverId: this.currentOpenedChat()?.id!,
        createdDate: new Date().toString(),
        isRead: false,
        id: 0,
      },
    ]);

    this.hubConnection
      ?.invoke('SendMessage', {
        receiverId: this.currentOpenedChat()?.id,
        content: message,
      })
      .then((id) => {
        console.log('Message send to: ', id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  notifyTyping() {
    this.hubConnection!.invoke(
      'NotifyTyping',
      this.currentOpenedChat()?.userName
    )
      .then((x) => {
        console.log('notify for ', x);
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
