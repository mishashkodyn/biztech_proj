import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoChatService } from './api/services/video-chat.service';
import { AuthService } from './api/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { VideoChatComponent } from './modules/chat/components/video-chat/video-chat.component';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'client';

  private signalRService = inject(VideoChatService);
  private authService = inject(AuthService);
  private matDialog = inject(MatDialog);

  ngOnInit(): void {
    if (!this.authService.getAccessToken) {
      return;
    }
    this.signalRService.startConnection();
    this.startOfferReceive();
  }

  startOfferReceive() {
    this.signalRService.offerReceived.subscribe(async (data) => {
      if (data) {
        this.matDialog.open(VideoChatComponent, {
          width: '400px',
          height: '600px',
          disableClose: false,
        });
        this.signalRService.remoteUserId = data.senderId;
        this.signalRService.incomingCall = true;
      }
    });
  }
}
