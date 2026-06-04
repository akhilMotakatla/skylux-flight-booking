import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FlightService } from '../../../core/services/flight.service';
import { BookingService } from '../../../core/services/booking.service';
import { Flight } from '../../../core/models/flight.model';
import { AirHostessComponent } from '../../../layout/air-hostess/air-hostess.component';

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DatePipe, DecimalPipe, AirHostessComponent],
  templateUrl: './booking-wizard.component.html',
  styleUrl: './booking-wizard.component.scss'
})
export class BookingWizardComponent implements OnInit {
  step = signal(1);
  flight = signal<Flight | null>(null);
  loading = signal(true);
  submitting = signal(false);
  error = signal('');
  bookingRef = signal('');
  selectedSeats = signal<string[]>([]);
  cardFlipped = signal(false);

  passengerCount = 1;
  form!: FormGroup;

  readonly rows = Array.from({ length: 30 }, (_, i) => i + 1);
  readonly cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  occupiedSeats = signal<string[]>([]);

  // Card fields (validated)
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  cardName = '';

  get cardType(): 'visa' | 'mastercard' | 'amex' | 'discover' | '' {
    const d = this.cardNumber.replace(/\s/g, '');
    if (!d) return '';
    if (d[0] === '4') return 'visa';
    if (d[0] === '5') return 'mastercard';
    if (d[0] === '3') return 'amex';
    if (d[0] === '6') return 'discover';
    return '';
  }

  get cardTypeIcon() {
    const icons: Record<string, string> = { visa: '💳 VISA', mastercard: '💳 MC', amex: '💳 AMEX', discover: '💳 DISC' };
    return icons[this.cardType] || '💳';
  }

  get hostessStep(): number {
    if (!this.flight()) return 0;
    return this.step();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private flightService: FlightService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    const passengers = +this.route.snapshot.queryParamMap.get('passengers')! || 1;
    this.passengerCount = passengers;

    this.flightService.getFlightById(id).subscribe({
      next: f => {
        this.flight.set(f);
        this.loading.set(false);
        this.generateOccupied(f.availableSeats, f.totalSeats ?? 180);
        this.buildForm(passengers);
      },
      error: () => { this.error.set('Flight not found.'); this.loading.set(false); }
    });
  }

  private generateOccupied(available: number, total: number) {
    const allSeats = this.rows.flatMap(r => this.cols.map(c => `${r}${c}`));
    const occupied = allSeats.sort(() => Math.random() - 0.5)
      .slice(0, Math.min(total - available, allSeats.length - 6));
    this.occupiedSeats.set(occupied);
  }

  private buildForm(count: number) {
    this.form = this.fb.group({
      passengers: this.fb.array(
        Array.from({ length: count }, () => this.fb.group({
          firstName:      ['', Validators.required],
          lastName:       ['', Validators.required],
          passportNumber: ['', Validators.required],
          dateOfBirth:    ['', Validators.required],
          nationality:    ['', Validators.required]
        }))
      )
    });
  }

  get passengersArray() { return this.form.get('passengers') as FormArray; }
  get passengerGroups() { return this.passengersArray.controls as FormGroup[]; }

  isSeatOccupied(seat: string) { return this.occupiedSeats().includes(seat); }
  isSeatSelected(seat: string) { return this.selectedSeats().includes(seat); }

  toggleSeat(seat: string) {
    if (this.isSeatOccupied(seat)) return;
    const sel = this.selectedSeats();
    if (sel.includes(seat)) {
      this.selectedSeats.set(sel.filter(s => s !== seat));
    } else if (sel.length < this.passengerCount) {
      this.selectedSeats.set([...sel, seat]);
    }
  }

  nextStep() {
    if (this.step() === 1 && this.selectedSeats().length < this.passengerCount) {
      alert(`Please select ${this.passengerCount} seat(s).`); return;
    }
    if (this.step() === 2 && this.form.invalid) {
      this.form.markAllAsTouched(); return;
    }
    if (this.step() === 3) {
      if (!this.isCardValid()) return;
    }
    this.step.update(s => s + 1);
  }

  prevStep() { this.step.update(s => Math.max(1, s - 1)); }

  // ── Card validation ──────────────────────────────────────────────────────
  onCardNumberInput(e: Event) {
    const el = e.target as HTMLInputElement;
    const raw = el.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    this.cardNumber = formatted;
    el.value = formatted;
  }

  onExpiryInput(e: Event) {
    const el = e.target as HTMLInputElement;
    const prev = this.cardExpiry;
    let raw = el.value.replace(/\D/g, '');
    if (raw.length > 4) raw = raw.slice(0, 4);
    if (raw.length >= 2) {
      let mm = parseInt(raw.slice(0, 2));
      if (mm > 12) mm = 12;
      if (mm < 1 && raw.length >= 2) mm = 1;
      const mmStr = mm.toString().padStart(2, '0');
      raw = mmStr + raw.slice(2);
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    // Handle backspace over slash
    if (prev.length === 3 && el.value.length === 2) raw = raw.slice(0, 1);
    this.cardExpiry = raw;
    el.value = raw;
  }

  onCvvInput(e: Event) {
    const el = e.target as HTMLInputElement;
    const raw = el.value.replace(/\D/g, '').slice(0, this.cardType === 'amex' ? 4 : 3);
    this.cardCvv = raw;
    el.value = raw;
  }

  onNameInput(e: Event) {
    const el = e.target as HTMLInputElement;
    // Allow only letters and spaces
    const raw = el.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    this.cardName = raw;
    el.value = raw;
  }

  isCardValid(): boolean {
    const num = this.cardNumber.replace(/\s/g, '');
    if (num.length < 13) { this.error.set('Please enter a valid card number (13–16 digits).'); return false; }
    if (!/^\d{2}\/\d{2}$/.test(this.cardExpiry)) { this.error.set('Please enter expiry as MM/YY.'); return false; }
    const cvvLen = this.cardType === 'amex' ? 4 : 3;
    if (this.cardCvv.length < cvvLen) { this.error.set(`CVV must be ${cvvLen} digits.`); return false; }
    if (!this.cardName.trim()) { this.error.set('Please enter the cardholder name.'); return false; }
    this.error.set('');
    return true;
  }

  confirm() {
    if (!this.isCardValid()) return;
    const f = this.flight();
    if (!f) return;
    this.submitting.set(true);
    this.error.set('');
    const passengers = this.passengerGroups.map(g => ({
      firstName: g.value.firstName, lastName: g.value.lastName,
      passportNumber: g.value.passportNumber,
      dateOfBirth: g.value.dateOfBirth, nationality: g.value.nationality
    }));
    this.bookingService.createBooking({
      flightId: f.id, passengers, seatNumbers: this.selectedSeats(), paymentMethod: 'mock'
    }).subscribe({
      next: b => {
        this.bookingRef.set(`SKY-${b.id.toString().padStart(6, '0')}`);
        this.step.set(4);
        this.submitting.set(false);
      },
      error: err => {
        this.error.set(err.error?.message || 'Booking failed. Please try again.');
        this.submitting.set(false);
      }
    });
  }

  formatDuration(mins: number) { return `${Math.floor(mins / 60)}h ${mins % 60}m`; }
  goToDashboard() { this.router.navigate(['/dashboard']); }
  goHome() { this.router.navigate(['/']); }
}
