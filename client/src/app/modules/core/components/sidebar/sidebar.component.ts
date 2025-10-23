import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { AuthService } from '../../../../api/services/auth.service';
import { User } from '../../../../api/models/user';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmModalComponent } from '../../../shared/logout-confirm-modal/logout-confirm-modal.component';

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
export class SidebarComponent {
  @Output() widthChanged = new EventEmitter<string>();

  sidebarCollapsed = signal(true);

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
  ]);
  profileImageSize = computed(() => (this.sidebarCollapsed() ? '40' : '100'));
  sidebarWidth = computed(() => (this.sidebarCollapsed() ? '60px' : '250px'));

  constructor(
    protected authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  toggleSidebar(action?: 'close' | 'open') {
    if (action === 'close') {
      this.sidebarCollapsed.set(true);
      this.widthChanged.emit(this.sidebarWidth());
      return;
    }
    this.sidebarCollapsed.update((v) => !v);
    this.widthChanged.emit(this.sidebarWidth());
  }

  logout() {
    const dialogRef = this.dialog.open(LogoutConfirmModalComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  settings() {
    this.toggleSidebar('close');
    this.router.navigate(['/settings']);
  }

  goToAccount() {
    const username = this.authService.currentLoggedUser?.userName;
    this.router.navigate(['/account', username]);
    this.toggleSidebar('close');
  }

  editAccount() {
    this.router.navigate(['/edit-account']);
    this.toggleSidebar('close');
  }
}
