import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../../api/services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-right-sidebar',
  standalone: false,
  templateUrl: './chat-right-sidebar.component.html',
  styleUrl: './chat-right-sidebar.component.scss',
})
export class ChatRightSidebarComponent{
  constructor(protected chatService: ChatService, private router: Router) {}

  goToProfile(userName: string) {
    this.router.navigate([`account/${userName}`])
  }


}
