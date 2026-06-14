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

  // ── Ticket tier definitions ─────────────────────────────────────────────────
  readonly ticketTiers = [
    { id: 'economy',          label: 'Economy',          tier: 'economy',  priceMul: 1,
      pitch: '28–30"',        baggage: '1×23 kg',        meals: 'Pay on board',
      cancel: '$150 fee',     refund: 'Non-refundable',  seatSel: '$10–20 extra',
      lounge: '—',            priority: '—',             wifi: '$10/flight',
      recline: 'Standard (18°)' },
    { id: 'deluxe_economy',   label: 'Deluxe Economy',   tier: 'economy',  priceMul: 1.3,
      pitch: '31–32"',        baggage: '1×23 kg',        meals: '1 meal included',
      cancel: '$100 fee',     refund: '10% refund',      seatSel: 'Standard seats free',
      lounge: '—',            priority: '—',             wifi: '$8/flight',
      recline: 'Enhanced (20°)' },
    { id: 'premium_economy',  label: 'Premium Economy',  tier: 'economy',  priceMul: 2.2,
      pitch: '34–38"',        baggage: '2×23 kg',        meals: 'Enhanced menu',
      cancel: '$50 fee',      refund: '50% refund',      seatSel: 'Any seat free',
      lounge: '—',            priority: 'Yes',           wifi: 'Complimentary',
      recline: 'Enhanced (25°) + leg rest' },
    { id: 'luxury_economy',   label: 'Luxury Economy',   tier: 'economy',  priceMul: 3.2,
      pitch: '38–40"',        baggage: '2×23 kg',        meals: 'Premium multi-course',
      cancel: '$25 fee',      refund: '75% refund',      seatSel: 'Any seat free',
      lounge: 'Partner lounge', priority: 'Yes',         wifi: 'Complimentary',
      recline: 'Recliner (30°) + leg rest' },
    { id: 'premium_business', label: 'Premium Business', tier: 'business', priceMul: 5.5,
      pitch: '58–72"',        baggage: '2×32 kg',        meals: 'À la carte menu',
      cancel: 'No fee',       refund: 'Full refund',     seatSel: 'Suite free',
      lounge: 'Business lounge', priority: 'Zone 1',    wifi: 'Complimentary',
      recline: 'Lie-flat (180°)' },
    { id: 'luxury_business',  label: 'Luxury Business',  tier: 'business', priceMul: 7.5,
      pitch: '72–78"',        baggage: '3×32 kg',        meals: 'Chef-curated + wine',
      cancel: 'No fee',       refund: 'Full + voucher',  seatSel: 'Private pod free',
      lounge: 'Premium lounge + spa', priority: 'Private lane', wifi: 'High-speed free',
      recline: 'Flat bed + privacy divider' },
    { id: 'first_class',      label: 'First Class',      tier: 'first',    priceMul: 12,
      pitch: '80–100" private suite', baggage: '3×32 kg + unlimited', meals: 'Personal chef',
      cancel: 'No fee + compensation', refund: 'Full + bonus miles', seatSel: 'Private suite',
      lounge: 'First class + chauffeur', priority: 'Dedicated bridge', wifi: 'Ultra high-speed',
      recline: 'Private suite with real bed' },
  ];

  selectedTiers = signal<Map<number, string>>(new Map());

  selectTier(flightId: number, tierId: string, event: Event) {
    event.stopPropagation();
    const m = new Map(this.selectedTiers());
    m.set(flightId, tierId);
    this.selectedTiers.set(m);
  }

  getSelectedTier(flightId: number) {
    const tierId = this.selectedTiers().get(flightId) ?? 'economy';
    return this.ticketTiers.find(t => t.id === tierId) ?? this.ticketTiers[0];
  }

  getTierPrice(basePrice: number, flightId: number): number {
    return Math.round(basePrice * this.getSelectedTier(flightId).priceMul);
  }

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
    // Store full flight so the booking wizard shows the correct itinerary,
    // not just the leg-1 DB fragment.
    sessionStorage.setItem('bookingFlight', JSON.stringify(flight));
    // Use abs(id) so the wizard can still fetch a real flight for seat layout;
    // for synthetic flights (id < 0) we fall back to id=1.
    const wizardId = flight.id > 0 ? flight.id : 1;
    this.router.navigate(['/flights', wizardId, 'book'], {
      queryParams: { passengers: this.passengers }
    });
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
