import { Component, ElementRef, ViewChild } from '@angular/core';
import { AiChatResponse, AiMessage } from '../../../../api/models/ai-chat-response';
import { AiChatMessage } from '../../../../api/models/ai-chat-message';
import { AiService } from '../../../../api/services/ai.service';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
  standalone: false,
})
export class AiChatComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  message: string = '';
  messages: AiChatMessage[] = [];
  isLoading: boolean = false;

  constructor(private service: AiService) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.message == null) return;

    const userMsg: AiChatMessage = {
      text: this.message,
      isUser: true,
      timestamp: new Date(),
    };
    this.messages.push(userMsg);
    this.scrollToBottom();    
    const currentMessage = this.message;
    this.message = '';
    this.isLoading = true;

    const conversationHistory: AiMessage[] = this.messages.slice(-10).map(msg =>({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text
    }));

    this.service.chatAsync(conversationHistory).subscribe({
      next: (response) => {
        this.messages.push({
          text: response.data,
          isUser: false,
          timestamp: new Date(),
        });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({
          text: "AI did't answer",
          isUser: false,
          timestamp: new Date(),
        });
        this.isLoading = false;
      },
    });
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
