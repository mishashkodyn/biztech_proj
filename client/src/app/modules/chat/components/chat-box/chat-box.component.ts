import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../../../api/services/chat.service';
import { AuthService } from '../../../../api/services/auth.service';
import { Message } from '../../../../api/models/message';

@Component({
  selector: 'app-chat-box',
  standalone: false,
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
})
export class ChatBoxComponent implements AfterViewChecked, AfterViewInit {
  // @ViewChild('chatBox', { read: ElementRef }) public chatBox?: ElementRef;
  @ViewChild('messageScroll') messageScroll: ElementRef | null = null;

  private previousMessageCount = 0;

  constructor(
    protected chatService: ChatService,
    protected authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.scrollDown();
  }

  addReplyMessage(message: Message) {
    if (message) {
      this.chatService.replyMessage.set(message);
    }
  }

  scrollDown() {
    this.messageScroll!.nativeElement.scrollTop = 0;
  }

  viewImage(url: string) {
    window.open(url, '_blank');
  }

  scrollDownAfterDelay() {
    if (this.messageScroll) {
      setTimeout(() => {
        this.scrollDown();
      }, 100);
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    const currentMessages = this.chatService.chatMessages().length;

    if (currentMessages !== this.previousMessageCount) {
      this.scrollToBottom();
      this.previousMessageCount = currentMessages;
    }
  }

  scrollToBottom(): void {
    if (this.messageScroll?.nativeElement) {
      this.messageScroll.nativeElement.scrollTop =
        this.messageScroll.nativeElement.scrollHeight;
    }
  }

  loadMoreMessage() {
    const nextPage = this.chatService.pageNumber() + 1;
    this.chatService.loadMessages(nextPage);
    this.scrollDown();
  }

  getBubbleClass(index: number): string {
    const messages = this.chatService.chatMessages();
    const currentMsg = messages[index];
    const prevMsg = messages[index - 1];
    const nextMsg = messages[index + 1];

    const isMe =
      currentMsg.senderId ===
      this.chatService['authService'].currentLoggedUser?.id;

    const isPrevSame = prevMsg && prevMsg.senderId === currentMsg.senderId;
    const isNextSame = nextMsg && nextMsg.senderId === currentMsg.senderId;

    let classes = isMe
      ? 'bg-mint text-slate-800 ml-auto '
      : 'bg-primary text-white mr-auto ';

    const radiusLarge = 'rounded-2xl';
    const radiusSmall = 'rounded-md';
    const radiusNone = 'rounded-none';

    if (isMe) {
      classes += 'rounded-l-2xl ';

      classes += isPrevSame ? `rounded-tr-${radiusSmall} ` : `rounded-tr-2xl `;

      classes += isNextSame ? `rounded-br-${radiusSmall} ` : 'rounded-br-none ';
    } else {
      classes += 'rounded-r-2xl ';

      classes += isPrevSame ? `rounded-tl-${radiusSmall} ` : `rounded-tl-2xl `;

      classes += isNextSame ? `rounded-bl-${radiusSmall} ` : 'rounded-bl-none ';
    }

    if (!isNextSame) {
      classes += 'mb-2';
    } else {
      classes += 'mb-0.5';
    }

    return classes;
  }
}
