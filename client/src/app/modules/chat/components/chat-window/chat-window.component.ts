import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../../../api/services/chat.service';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChatBoxComponent } from '../chat-box/chat-box.component';

@Component({
  selector: 'app-chat-window',
  standalone: false,
  templateUrl: './chat-window.component.html',
  styles: ``,
})
export class ChatWindowComponent {
  @ViewChild('chatBox') chatContainer?: ElementRef;
  message: string = '';
  private shouldScroll = false;

  constructor(protected chatService: ChatService) {}

  sendMessage() {
    if (!this.message) return;
    this.chatService.sendMessage(this.message);
    this.message = '';
    this.scrollToBottom()

  }

  private scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    }
  }
}
