import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { ChatRightSidebarComponent } from './components/chat-right-sidebar/chat-right-sidebar.component';
import { ChatSidebarComponent } from './components/chat-sidebar/chat-sidebar.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { ChatComponent } from './pages/chat/chat.component';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChatComponent,
    ChatBoxComponent,
    ChatRightSidebarComponent,
    ChatSidebarComponent,
    ChatWindowComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinner,
    DatePipe,
    MatIconModule,
    TitleCasePipe,
    MatMenuModule,
    SharedModule,
    FormsModule,
  ]
})
export class ChatModule { }
