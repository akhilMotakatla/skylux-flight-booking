import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Airport } from '../models/airport.model';

@Injectable({ providedIn: 'root' })
export class AirportService {
  private readonly API = `${environment.apiUrl}/api/airports`;

  constructor(private http: HttpClient) {}

  searchAirports(query: string): Observable<Airport[]> {
    if (!query || query.length < 2) return new Observable(o => o.next([]));
    const params = new HttpParams().set('q', query);
    return this.http.get<Airport[]>(`${this.API}/search`, { params });
  }

  searchAirports$(query$: Observable<string>): Observable<Airport[]> {
    return query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => this.searchAirports(q))
    );
  }
}
