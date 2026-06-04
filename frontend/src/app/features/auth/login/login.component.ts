import { Component, signal, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <canvas #pCanvas class="particles-layer"></canvas>
      <div class="auth-card glass-card"
           (mousemove)="onMouseMove($event)"
           (mouseleave)="resetTilt()"
           [style.transform]="tilt()">
        <div class="auth-logo">✈ Sky<span class="gold-text">Lux</span></div>
        <h2>Welcome Back</h2>
        <p class="auth-sub">Sign in to your account</p>

        @if (error()) {
          <div class="auth-error">⚠️ {{ error() }}</div>
        }

        <form (ngSubmit)="login()">
          <div class="field">
            <label>Email</label>
            <input [(ngModel)]="email" name="email" type="email" placeholder="you@example.com" class="glass-input" required />
          </div>
          <div class="field">
            <label>Password</label>
            <input [(ngModel)]="password" name="password" type="password" placeholder="••••••••" class="glass-input" required />
          </div>
          <button type="submit" class="btn-gold auth-btn" [disabled]="loading()">
            {{ loading() ? 'Signing In…' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Create one</a></p>
          <div class="demo-creds">
            <p class="hint">Demo credentials:</p>
            <code (click)="fillDemo('demo@skylux.com','Demo@123')">demo@skylux.com / Demo@123</code>
            <code (click)="fillDemo('admin@skylux.com','Admin@123')">admin@skylux.com / Admin@123</code>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('pCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  email = ''; password = '';
  loading = signal(false);
  error   = signal('');
  tilt    = signal('');

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  login() {
    this.loading.set(true); this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const ret = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        this.router.navigateByUrl(ret);
      },
      error: err => { this.error.set(err.error?.message || 'Login failed.'); this.loading.set(false); }
    });
  }

  fillDemo(e: string, p: string) { this.email = e; this.password = p; }

  onMouseMove(e: MouseEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -14;
    this.tilt.set(`perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`);
  }
  resetTilt() { this.tilt.set('perspective(1000px) rotateX(0) rotateY(0)'); }
}
