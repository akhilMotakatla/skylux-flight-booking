import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Flight, FlightSearchParams } from '../models/flight.model';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private readonly API = `${environment.apiUrl}/api/flights`;

  constructor(private http: HttpClient) {}

  searchFlights(params: FlightSearchParams) {
    const p = new HttpParams()
      .set('from', params.from)
      .set('to', params.to)
      .set('date', params.date)
      .set('passengers', params.passengers.toString())
      .set('class', params.class);
    return this.http.get<Flight[]>(`${this.API}/search`, { params: p });
  }

  getFlightById(id: number) {
    return this.http.get<Flight>(`${this.API}/${id}`);
  }
}
