import { Component, computed, Input, OnInit, Output, signal } from '@angular/core';
import { AuthService } from '../../../../api/services/auth.service';
import { User } from '../../../../api/models/user';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {

  user: User | null = null;
  sidebarCollapsed = signal(false);
  
  @Input() set collapsed(val: boolean) {
    this.sidebarCollapsed.set(val);
  } 
  menuItems = signal<MenuItem[]>([
    {
      icon: 'home',
      label: 'Home',
      route: 'home',
    },
    {
      icon: 'chat',
      label: 'Chat',
      route: 'chat',
    },
  ]);

  adminItems = signal<MenuItem[]>([
    {
      icon: 'person',
      label: 'Users',
      route: 'users',
    },
  ])
  profileImageSize = computed(() => this.sidebarCollapsed() ? '32' : '100')

  constructor(protected authService: AuthService) {}

  ngOnInit(): void {
    var loggedInUser = this.authService.currentLoggedUser;

    if (loggedInUser) {
      this.user = loggedInUser;
    }
  }

}
