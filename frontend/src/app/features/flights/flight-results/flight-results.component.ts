import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FlightService } from '../../../core/services/flight.service';
import { Flight } from '../../../core/models/flight.model';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe],
  templateUrl: './flight-results.component.html',
  styleUrl: './flight-results.component.scss'
})
export class FlightResultsComponent implements OnInit {
  flights = signal<Flight[]>([]);
  filtered = signal<Flight[]>([]);
  loading = signal(true);
  error = signal('');

  // Search params
  from = ''; to = ''; date = ''; passengers = 1; flightClass = 'Economy';

  // Filters
  maxPrice = signal(5000);
  selectedAirlines = signal<string[]>([]);
  sortBy = signal<'price'|'duration'|'departure'>('price');
  expandedId = signal<number | null>(null);

  allAirlines = signal<string[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      this.from = p['from'] || '';
      this.to   = p['to']   || '';
      this.date = p['date'] || '';
      this.passengers  = +p['passengers'] || 1;
      this.flightClass = p['class'] || 'Economy';
      this.loadFlights();
    });
  }

  loadFlights() {
    if (!this.from || !this.to || !this.date) return;
    this.loading.set(true);
    this.error.set('');
    this.flightService.searchFlights({ from: this.from, to: this.to, date: this.date, passengers: this.passengers, class: this.flightClass })
      .subscribe({
        next: fs => {
          this.flights.set(fs);
          this.allAirlines.set([...new Set(fs.map(f => f.airlineName))]);
          this.applyFilters();
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load flights. Please try again.');
          this.loading.set(false);
        }
      });
  }

  applyFilters() {
    let fs = this.flights().filter(f =>
      f.price <= this.maxPrice() &&
      (this.selectedAirlines().length === 0 || this.selectedAirlines().includes(f.airlineName))
    );
    const s = this.sortBy();
    if (s === 'price')     fs = fs.sort((a,b) => a.price - b.price);
    if (s === 'duration')  fs = fs.sort((a,b) => a.durationMinutes - b.durationMinutes);
    if (s === 'departure') fs = fs.sort((a,b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
    this.filtered.set(fs);
  }

  toggleAirline(name: string) {
    this.selectedAirlines.update(arr =>
      arr.includes(name) ? arr.filter(a => a !== name) : [...arr, name]
    );
    this.applyFilters();
  }

  formatDuration(mins: number): string {
    return `${Math.floor(mins/60)}h ${mins%60}m`;
  }

  book(flight: Flight) {
    this.router.navigate(['/flights', flight.id, 'book']);
  }

  toggleExpand(id: number) {
    this.expandedId.update(cur => cur === id ? null : id);
  }

  goHome() { this.router.navigate(['/']); }

  logoUrl(code: string): string {
    return `https://www.gstatic.com/flights/airline_logos/70px/${code}.png`;
  }

  onLogoError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('hidden');
    const fallback = img.nextElementSibling as HTMLElement;
    if (fallback) fallback.classList.remove('hidden');
  }
}
