import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgTemplateOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  cancelling = signal<number | null>(null);

  constructor(public auth: AuthService, private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getMyBookings().subscribe({
      next: bs => { this.bookings.set(bs); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  get upcoming() { return this.bookings().filter(b => b.status === 'Confirmed' && new Date(b.departureTime) > new Date()); }
  get past()     { return this.bookings().filter(b => b.status === 'Cancelled' || new Date(b.departureTime) <= new Date()); }

  cancel(id: number) {
    if (!confirm('Cancel this booking?')) return;
    this.cancelling.set(id);
    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        this.bookings.update(bs => bs.map(b => b.id === id ? {...b, status:'Cancelled'} : b));
        this.cancelling.set(null);
      },
      error: () => this.cancelling.set(null)
    });
  }

  isPast(b: Booking) { return new Date(b.departureTime) <= new Date(); }
  formatDuration(dep: string, arr: string) {
    const mins = (new Date(arr).getTime() - new Date(dep).getTime()) / 60000;
    return `${Math.floor(mins/60)}h ${mins%60}m`;
  }
}
