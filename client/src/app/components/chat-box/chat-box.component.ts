import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-box',
  imports: [ MatProgressSpinner, DatePipe, MatIconModule ],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent {

  private pageNumber = 2;

  constructor(
    protected chatService: ChatService,
    protected authService: AuthService
  ){}

  loadMoreMessage() {
    this.pageNumber = 2;
    this.chatService.loadMessages(this.pageNumber)
  }

}
