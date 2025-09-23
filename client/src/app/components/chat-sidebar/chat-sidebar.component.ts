import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { User } from '../../models/user';
import { TypingIndicatorComponent } from '../typing-indicator/typing-indicator.component';

@Component({
  selector: 'app-chat-sidebar',
  imports: [MatIconModule, MatMenuModule, TypingIndicatorComponent, TitleCasePipe],
  templateUrl: './chat-sidebar.component.html',
  styles: ``,
})
export class ChatSidebarComponent implements OnInit {
  constructor(
    protected authService: AuthService,
    private router: Router,
    protected chatService: ChatService
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.chatService.disconnectConnection();
  }

  ngOnInit(): void {
    this.chatService.startConnection(this.authService.getAccessToken!)
  }

  openChatWindow(user: User) {
    this.chatService.currentOpenedChat.set(user);
    this.chatService.loadMessages(1);
  }
}
