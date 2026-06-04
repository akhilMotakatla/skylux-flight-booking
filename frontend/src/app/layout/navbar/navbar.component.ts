import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()">
      <div class="nav-inner container">
        <a routerLink="/" class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L28 12H22L28 20H18L16 30L14 20H4L10 12H4L16 2Z" fill="#d4a017"/>
            <path d="M16 6L24 13H20L24 19H17L16 26L15 19H8L12 13H8L16 6Z" fill="#f5c842"/>
          </svg>
          <span class="logo-text">Sky<span class="gold">Lux</span></span>
        </a>

        <div class="nav-links" [class.open]="menuOpen()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMenu()">Home</a>
          <a routerLink="/flights/search" routerLinkActive="active" (click)="closeMenu()">Flights</a>
          @if (auth.isAuthenticated()) {
            <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">My Bookings</a>
          }
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active" (click)="closeMenu()">Admin</a>
          }
        </div>

        <div class="nav-actions">
          @if (!auth.isAuthenticated()) {
            <a routerLink="/login" class="btn-ghost btn-sm">Sign In</a>
            <a routerLink="/register" class="btn-gold btn-sm">Join Free</a>
          } @else {
            <span class="user-name">{{ auth.user()?.name }}</span>
            <button class="btn-ghost btn-sm" (click)="auth.logout()">Sign Out</button>
          }
        </div>

        <button class="hamburger" (click)="menuOpen.set(!menuOpen())" [class.open]="menuOpen()">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isScrolled = signal(false);
  menuOpen = signal(false);

  constructor(public auth: AuthService) {}

  @HostListener('window:scroll')
  onScroll() { this.isScrolled.set(window.scrollY > 80); }

  closeMenu() { this.menuOpen.set(false); }
}
