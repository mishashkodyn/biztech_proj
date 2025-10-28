import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  sidebarWidth = '60px';

  onSidebarWidthChanged(newWidth: string) {
    this.sidebarWidth = newWidth;
  }
}
