import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ChatBoxComponent } from "../chat-box/chat-box.component";

@Component({
  selector: 'app-chat-window',
  imports: [TitleCasePipe, MatIconModule, FormsModule, ChatBoxComponent],
  templateUrl: './chat-window.component.html',
  styles: ``
})
export class ChatWindowComponent {

  message:string = '';

  constructor( protected chatService: ChatService){}

  sendMessage(){
    if (!this.message) return;
    this.chatService.sendMessage(this.message);
    this.message = '';
  }
}
