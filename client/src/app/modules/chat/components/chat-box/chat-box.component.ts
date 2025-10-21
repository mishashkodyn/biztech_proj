import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../../../api/services/chat.service';
import { AuthService } from '../../../../api/services/auth.service';

@Component({
  selector: 'app-chat-box',
  standalone: false,
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
})
export class ChatBoxComponent implements AfterViewChecked {
  @ViewChild('chatBox', { read: ElementRef }) public chatBox?: ElementRef;

  constructor(
    protected chatService: ChatService,
    protected authService: AuthService
  ) {}

  loadMoreMessage() {
    const nextPage = this.chatService.pageNumber() + 1;
    this.chatService.loadMessages(nextPage);
    this.scrollTop();
  }

  ngAfterViewChecked(): void {
    if (this.chatService.autoScrollEnabled()) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    this.chatService.autoScrollEnabled.set(true);
    this.chatBox!.nativeElement.scrollTo({
      top: this.chatBox!.nativeElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  scrollTop() {
    this.chatService.autoScrollEnabled.set(false);
    this.chatBox!.nativeElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
