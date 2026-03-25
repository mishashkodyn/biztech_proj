import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../api/services/notification.service';
import { AppNotification } from '../../../../api/models/notification.model';

@Component({
  selector: 'app-notifications-page',
  standalone: false,
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent implements OnInit {
  notifications: AppNotification[] | [] = [];
  isLoading: boolean = false;

  constructor(private service: NotificationService) {
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(){
    this.isLoading = true;
    this.service.getMyNotifications().subscribe((res) => {
      this.notifications = res.data;
      this.isLoading = false;
    })
  }
}
