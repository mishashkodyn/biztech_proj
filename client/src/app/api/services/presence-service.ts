import { Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private hubUrl = `${environment.hubUrl}/online-users`;
  private hubConnection?: HubConnection;
  onlineUsers = signal<User[]>([]);

  constructor() {}

  startConnection(token: string) {
    if (this.hubConnection?.state === HubConnectionState.Connected) return;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch((error) => console.error('Presence Hub Error: ', error));

    this.hubConnection.on('OnlineUsers', (users: User[]) => {
      this.onlineUsers.set(users);
    });

    this.hubConnection.on('Notify', (user: User) => {
      this.showOnlineNotification(user);
    });
  }

  stopConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop();
    }
  }

  private showOnlineNotification(user: User) {
    if (Notification.permission === 'granted') {
      new Notification('Active now 🟢', {
        body: `${user.name} ${user.surname} is online now`,
        icon: user.profileImage,
      });
    }
  }
}