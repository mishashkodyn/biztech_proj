import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { ChatService } from '../../../../api/services/chat.service';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChatBoxComponent } from '../chat-box/chat-box.component';
import { VideoChatService } from '../../../../api/services/video-chat.service';
import { MatDialog } from '@angular/material/dialog';
import { VideoChatComponent } from '../video-chat/video-chat.component';

@Component({
  selector: 'app-chat-window',
  standalone: false,
  templateUrl: './chat-window.component.html',
  styles: ``,
})
export class ChatWindowComponent {
  @ViewChild('chatBox') chatContainer?: ElementRef;
  dialog = inject(MatDialog)
  signalRService = Inject(VideoChatService);
  message: string = '';
  private shouldScroll = false;

  constructor(protected chatService: ChatService) {}

  displayDialog(receiverId?: string) {
    this.signalRService.remoteUserId = receiverId;
    this.dialog.open(VideoChatComponent, {
      width: '400px',
      height: '600px',
      disableClose: true,
      autoFocus: false
    })
  }

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
