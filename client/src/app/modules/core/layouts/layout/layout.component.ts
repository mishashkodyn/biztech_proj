import { Component, computed, HostListener, signal, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = signal(false);
  navMode = computed(() => this.isMobile() ? 'over' : 'side');
  sidebarWidth = '60px';
  private touchStartX = 0;
  private touchEndX = 0;
  private readonly SWIPE_THRESHOLD = 50;
  private readonly EDGE_THRESHOLD = 40;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile.set(result.matches);
        
        setTimeout(() => {
             if (this.sidenav) {
                result.matches ? this.sidenav.close() : this.sidenav.open();
             }
        });
      });
  }

  onSidebarWidthChanged(newWidth: string) {
    this.sidebarWidth = newWidth;
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    this.touchEndX = e.changedTouches[0].clientX;
    this.handleSwipe();
  }

  private handleSwipe() {
    if (!this.isMobile()) return;

    const swipeDistance = this.touchEndX - this.touchStartX;

    if (this.touchStartX < this.EDGE_THRESHOLD && swipeDistance > this.SWIPE_THRESHOLD) {
      this.sidenav.open();
    }
    
    if (swipeDistance < -this.SWIPE_THRESHOLD && this.sidenav.opened) {
      this.sidenav.close();
    }
  }

  closeOnMobile() {
    if (this.isMobile()) {
      this.sidenav.close();
    }
  }
}
