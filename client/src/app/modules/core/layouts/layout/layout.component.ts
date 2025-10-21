import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  collapsed = signal(false);
  sidebarWidth = computed(() => this.collapsed() ? '60px' : '250px')
}
