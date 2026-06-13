import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()">
      <!-- Animated gradient border -->
      <div class="nav-glow-bar"></div>

      <div class="nav-inner container">

        <!-- Logo -->
        <a routerLink="/" class="logo" (click)="closeMenu()">
          <div class="logo-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <defs>
                <radialGradient id="logoGrd" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stop-color="#fde68a"/>
                  <stop offset="100%" stop-color="#d4a017"/>
                </radialGradient>
              </defs>
              <path d="M18 3L32 14H25L32 23H20L18 33L16 23H4L11 14H4L18 3Z" fill="url(#logoGrd)"/>
              <path d="M18 7L28 15H23L28 21H19L18 29L17 21H8L13 15H8L18 7Z" fill="#fff8" opacity="0.4"/>
            </svg>
            <div class="logo-pulse"></div>
          </div>
          <div class="logo-wordmark">
            <span class="logo-sky">Sky</span><span class="logo-lux">Lux</span>
            <span class="logo-tag">PREMIUM</span>
          </div>
        </a>

        <!-- Desktop Nav -->
        <div class="nav-links" [class.open]="menuOpen()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"
             class="nav-link" (click)="closeMenu()">
            <span class="link-icon">🏠</span><span>Home</span>
          </a>
          <a routerLink="/flights/search" routerLinkActive="active"
             class="nav-link" (click)="closeMenu()">
            <span class="link-icon">✈️</span><span>Flights</span>
          </a>
          <a routerLink="/cars" routerLinkActive="active"
             class="nav-link nav-link--cars" (click)="closeMenu()">
            <span class="link-icon">🚗</span><span>Car Rental</span>
            <span class="nav-badge">New</span>
          </a>
          @if (auth.isAuthenticated()) {
            <a routerLink="/dashboard" routerLinkActive="active"
               class="nav-link" (click)="closeMenu()">
              <span class="link-icon">📋</span><span>My Bookings</span>
            </a>
          }
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active"
               class="nav-link" (click)="closeMenu()">
              <span class="link-icon">⚙️</span><span>Admin</span>
            </a>
          }
        </div>

        <!-- Actions -->
        <div class="nav-actions">
          @if (!auth.isAuthenticated()) {
            <a routerLink="/login" class="btn-ghost btn-sm">Sign In</a>
            <a routerLink="/register" class="btn-cta btn-sm">
              <span>Join Free</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          } @else {
            <div class="user-chip">
              <div class="user-avatar">{{ auth.user()?.name?.charAt(0) ?? 'U' }}</div>
              <span class="user-name">{{ auth.user()?.name }}</span>
            </div>
            <button class="btn-ghost btn-sm" (click)="auth.logout()">Sign Out</button>
          }
        </div>

        <!-- Hamburger -->
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
  menuOpen   = signal(false);

  constructor(public auth: AuthService) {}

  @HostListener('window:scroll')
  onScroll() { this.isScrolled.set(window.scrollY > 60); }

  closeMenu() { this.menuOpen.set(false); }
}
