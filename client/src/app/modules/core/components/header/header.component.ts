import { Component, signal } from '@angular/core';
import { MenuItem } from '../../../../api/models/menu-item';
import { Router } from '@angular/router';
import { AuthService } from '../../../../api/services/auth.service';
import { DropdownItem } from '../../../../api/models/dropdown-item';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: false,
})
export class HeaderComponent {
  menuItems = signal<MenuItem[]>([
    {
      label: 'FAQ',
    },
    {
      label: 'About us',
    },
    {
      label: 'Contacts',
    },
  ]);

  languages: DropdownItem[] = [
    { label: 'EN', value: 'en'},
    { label: 'UA', value: 'ua'}
  ];

  currentLanguage = this.languages[0];

  constructor(private route: Router, protected authService: AuthService) {}

  navigateTo(to: string) {
    switch (to) {
      case 'login': {
        this.route.navigate(['/login']);
        break;
      }
      case 'registration': {
        this.route.navigate(['/register']);
        break;
      }
      case 'home': {
        this.route.navigate(['/home']);
        break;
      }
      case 'chat': {
        this.route.navigate(['/chat']);
        break;
      }
      case 'ai-chat': {
        this.route.navigate(['/ai-chat']);
        break;
      }
    }
  }

  logout() {
    this.authService.logout();
    this.route.navigate(['/login']);
  }

  visibilityButtons(): boolean {
    if (this.route.url == '/login' || this.route.url == '/register' || this.authService.isLoggedIn() == false) {
      return true;
    }
    return false;
  }

  onLanguageChange() {
    console.log('Language changed to:', this.currentLanguage.value);
  }
}
