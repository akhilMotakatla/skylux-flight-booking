import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/api/auth`;
  private _user = signal<User | null>(this.loadUser());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === 'Admin');

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<User>(`${this.API}/login`, { email, password }).pipe(
      tap(u => this.setUser(u))
    );
  }

  register(name: string, email: string, password: string) {
    return this.http.post<User>(`${this.API}/register`, { name, email, password }).pipe(
      tap(u => this.setUser(u))
    );
  }

  logout() {
    localStorage.removeItem('skylux_user');
    this._user.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this._user()?.token ?? null;
  }

  private setUser(u: User) {
    localStorage.setItem('skylux_user', JSON.stringify(u));
    this._user.set(u);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem('skylux_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
