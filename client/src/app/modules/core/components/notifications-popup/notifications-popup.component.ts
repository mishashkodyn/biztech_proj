import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications-popup',
  standalone: false,
  templateUrl: './notifications-popup.component.html',
  styleUrl: './notifications-popup.component.scss'
})
export class NotificationsPopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  constructor(private router: Router) {}
  markAllAsRead(){
    console.log("Marking all as read");
  }

  viewAll() {
    this.router.navigate(['/notifications']);
    this.closePopup.emit();
  }
}
