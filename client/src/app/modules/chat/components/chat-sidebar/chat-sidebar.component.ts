import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../api/services/auth.service';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChatService } from '../../../../api/services/chat.service';
import { User } from '../../../../api/models/user';
import { TypingIndicatorComponent } from '../../../shared/typing-indicator/typing-indicator.component';

@Component({
  selector: 'app-chat-sidebar',
  standalone: false,
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
