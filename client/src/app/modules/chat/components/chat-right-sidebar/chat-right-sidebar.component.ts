import { Component } from '@angular/core';
import { ChatService } from '../../../../api/services/chat.service';

@Component({
  selector: 'app-chat-right-sidebar',
  standalone: false,
  templateUrl: './chat-right-sidebar.component.html',
  styleUrl: './chat-right-sidebar.component.scss',
})
export class ChatRightSidebarComponent {
  constructor(protected chatService: ChatService) {}


}
