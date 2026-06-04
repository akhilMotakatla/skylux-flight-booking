import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  activeTab = signal<'flights' | 'users' | 'bookings'>('flights');
  flights  = signal<any[]>([]);
  users    = signal<any[]>([]);
  bookings = signal<any[]>([]);
  loading  = signal(true);

  constructor(private http: HttpClient) {}

  ngOnInit() { this.loadFlights(); }

  loadFlights() {
    this.loading.set(true);
    this.http.get<any>(`${environment.apiUrl}/api/admin/flights`).subscribe({
      next: r => { this.flights.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  loadUsers() {
    this.loading.set(true);
    this.http.get<any[]>(`${environment.apiUrl}/api/admin/users`).subscribe({
      next: u => { this.users.set(u); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  loadBookings() {
    this.loading.set(true);
    this.http.get<any>(`${environment.apiUrl}/api/admin/bookings`).subscribe({
      next: r => { this.bookings.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  switchTab(tab: 'flights' | 'users' | 'bookings') {
    this.activeTab.set(tab);
    if (tab === 'flights')  this.loadFlights();
    if (tab === 'users')    this.loadUsers();
    if (tab === 'bookings') this.loadBookings();
  }

  deleteFlight(id: number) {
    if (!confirm('Delete this flight?')) return;
    this.http.delete(`${environment.apiUrl}/api/admin/flights/${id}`).subscribe({
      next: () => this.flights.update(fs => fs.filter(f => f.id !== id))
    });
  }

  formatDuration(dep: string, arr: string) {
    const mins = Math.round((new Date(arr).getTime() - new Date(dep).getTime()) / 60000);
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }
}
