import {
  AfterViewChecked,
  AfterViewInit,
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
export class ChatBoxComponent implements AfterViewChecked, AfterViewInit {
  // @ViewChild('chatBox', { read: ElementRef }) public chatBox?: ElementRef;
  @ViewChild('messageScroll') messageScroll: ElementRef | null = null;

  private previousMessageCount = 0;

  constructor(
    protected chatService: ChatService,
    protected authService: AuthService
  ) {}

  ngOnInit(): void {
    this.scrollDown();
  }

  scrollDown() {
    this.messageScroll!.nativeElement.scrollTop = 0;
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

  // ngAfterViewChecked(): void {
  //   if (this.chatService.autoScrollEnabled()) {
  //     this.scrollToBottom();
  //   }
  // }

  // scrollToBottom() {
  //   this.chatService.autoScrollEnabled.set(true);
  //   this.chatBox!.nativeElement.scrollTo({
  //     top: this.chatBox!.nativeElement.scrollHeight,
  //     behavior: 'smooth',
  //   });
  // }

  // scrollTop() {
  //   this.chatService.autoScrollEnabled.set(false);
  //   this.chatBox!.nativeElement.scrollTo({
  //     top: 0,
  //     behavior: 'smooth',
  //   });
  // }
}
