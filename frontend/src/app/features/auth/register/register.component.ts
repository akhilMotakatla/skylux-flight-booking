import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card glass-card"
           (mousemove)="onMouseMove($event)"
           (mouseleave)="resetTilt()"
           [style.transform]="tilt()">
        <div class="auth-logo">✈ Sky<span class="gold-text">Lux</span></div>
        <h2>Create Account</h2>
        <p class="auth-sub">Join millions of travellers worldwide</p>

        @if (error()) { <div class="auth-error">⚠️ {{ error() }}</div> }

        <form (ngSubmit)="register()">
          <div class="field">
            <label>Full Name</label>
            <input [(ngModel)]="name" name="name" placeholder="John Doe" class="glass-input" required />
          </div>
          <div class="field">
            <label>Email</label>
            <input [(ngModel)]="email" name="email" type="email" placeholder="you@example.com" class="glass-input" required />
          </div>
          <div class="field">
            <label>Password</label>
            <input [(ngModel)]="password" name="password" type="password" placeholder="Min 6 characters" class="glass-input" required minlength="6" />
          </div>
          <button type="submit" class="btn-gold auth-btn" [disabled]="loading()">
            {{ loading() ? 'Creating Account…' : 'Create Account' }}
          </button>
        </form>
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name = ''; email = ''; password = '';
  loading = signal(false); error = signal(''); tilt = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.loading.set(true); this.error.set('');
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => { this.error.set(err.error?.message || 'Registration failed.'); this.loading.set(false); }
    });
  }
  onMouseMove(e: MouseEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -14;
    this.tilt.set(`perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`);
  }
  resetTilt() { this.tilt.set(''); }
}
