import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CarListing {
  id: number;
  name: string;
  brand: string;
  category: string;
  emoji: string;
  seats: number;
  bags: number;
  transmission: string;
  fuel: string;
  pricePerDay: number;
  rating: number;
  reviews: number;
  features: string[];
  color: string;
  available: boolean;
}

export interface DriverDetail {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  licenseNumber: string;
  dateOfBirth: string;
  nationality: string;
}

export interface CreateCarRentalDto {
  carId: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  driver: DriverDetail;
  addOns: string[];
  totalPrice: number;
  carName: string;
  carCategory: string;
  carPricePerDay: number;
  carEmoji: string;
}

export interface CarRentalResponse {
  id: number;
  carName: string;
  carCategory: string;
  carEmoji: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalPrice: number;
  status: string;
  bookingDate: string;
}

@Injectable({ providedIn: 'root' })
export class CarService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/api/cars`;

  createRental(dto: CreateCarRentalDto) {
    return this.http.post<CarRentalResponse>(`${this.api}/rentals`, dto);
  }

  getMyRentals() {
    return this.http.get<CarRentalResponse[]>(`${this.api}/rentals/my`);
  }
}
