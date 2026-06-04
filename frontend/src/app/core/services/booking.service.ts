import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Booking, CreateBookingRequest } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly API = `${environment.apiUrl}/api/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(dto: CreateBookingRequest) {
    return this.http.post<Booking>(this.API, dto);
  }

  getMyBookings() {
    return this.http.get<Booking[]>(`${this.API}/my`);
  }

  cancelBooking(id: number) {
    return this.http.delete<{ message: string }>(`${this.API}/${id}`);
  }
}
