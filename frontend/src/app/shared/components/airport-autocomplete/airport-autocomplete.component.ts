import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { AirportService } from '../../../core/services/airport.service';
import { Airport } from '../../../core/models/airport.model';

@Component({
  selector: 'app-airport-autocomplete',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="airport-wrap">
      <div class="input-icon">{{ icon }}</div>
      <input
        [(ngModel)]="displayValue"
        (ngModelChange)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown)="onKey($event)"
        [placeholder]="placeholder"
        class="airport-input glass-input"
        autocomplete="off"
      />
      @if (results().length && showDropdown()) {
        <div class="dropdown">
          @for (airport of results(); track airport.iata; let i = $index) {
            <div
              class="option"
              [class.highlighted]="i === activeIndex()"
              (mousedown)="select(airport)"
            >
              <span class="iata">{{ airport.iata }}</span>
              <span class="info">{{ airport.city }}, {{ airport.country }}</span>
              <span class="name">{{ airport.name }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './airport-autocomplete.component.scss'
})
export class AirportAutocompleteComponent {
  @Input() placeholder = 'City or Airport';
  @Input() icon = '🛫';
  @Output() selected = new EventEmitter<Airport>();

  displayValue = '';
  results = signal<Airport[]>([]);
  showDropdown = signal(false);
  activeIndex = signal(-1);

  private query$ = new Subject<string>();

  constructor(private airportService: AirportService) {
    this.airportService.searchAirports$(this.query$).subscribe(r => this.results.set(r));
  }

  onInput(val: string) {
    this.query$.next(val);
    this.showDropdown.set(true);
    this.activeIndex.set(-1);
  }

  onFocus() {
    if (this.results().length) this.showDropdown.set(true);
  }

  onBlur() {
    setTimeout(() => this.showDropdown.set(false), 200);
  }

  onKey(e: KeyboardEvent) {
    const len = this.results().length;
    if (e.key === 'ArrowDown') { this.activeIndex.update(i => Math.min(i + 1, len - 1)); e.preventDefault(); }
    if (e.key === 'ArrowUp')   { this.activeIndex.update(i => Math.max(i - 1, 0)); e.preventDefault(); }
    if (e.key === 'Enter' && this.activeIndex() >= 0) { this.select(this.results()[this.activeIndex()]); }
    if (e.key === 'Escape') { this.showDropdown.set(false); }
  }

  select(airport: Airport) {
    this.displayValue = `${airport.iata} – ${airport.city}`;
    this.showDropdown.set(false);
    this.results.set([]);
    this.selected.emit(airport);
  }

  setValue(iata: string, city: string) {
    this.displayValue = iata ? `${iata} – ${city}` : '';
  }
}
