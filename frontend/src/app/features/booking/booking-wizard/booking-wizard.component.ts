import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FlightService } from '../../../core/services/flight.service';
import { BookingService } from '../../../core/services/booking.service';
import { Flight } from '../../../core/models/flight.model';

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DatePipe, DecimalPipe],
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

  // Seat map
  readonly rows = Array.from({length: 30}, (_, i) => i + 1);
  readonly cols = ['A','B','C','D','E','F'];
  readonly occupiedSeats = signal<string[]>([]);

  // Mock card
  cardNumber = ''; cardExpiry = ''; cardCvv = ''; cardName = '';

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
    const occupied: string[] = [];
    const occupiedCount = total - available;
    const allSeats = this.rows.flatMap(r => this.cols.map(c => `${r}${c}`));
    const shuffled = allSeats.sort(() => Math.random() - 0.5);
    this.occupiedSeats.set(shuffled.slice(0, Math.min(occupiedCount, allSeats.length - 5)));
  }

  private buildForm(count: number) {
    this.form = this.fb.group({
      passengers: this.fb.array(
        Array.from({length: count}, () => this.fb.group({
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
    this.step.update(s => s + 1);
  }

  prevStep() { this.step.update(s => Math.max(1, s - 1)); }

  confirm() {
    const f = this.flight();
    if (!f) return;
    this.submitting.set(true);
    const passengers = this.passengerGroups.map(g => ({
      firstName: g.value.firstName, lastName: g.value.lastName,
      passportNumber: g.value.passportNumber,
      dateOfBirth: g.value.dateOfBirth, nationality: g.value.nationality
    }));
    this.bookingService.createBooking({
      flightId: f.id, passengers, seatNumbers: this.selectedSeats(), paymentMethod: 'mock'
    }).subscribe({
      next: b => {
        this.bookingRef.set(`SKY-${b.id.toString().padStart(6,'0')}`);
        this.step.set(4);
        this.submitting.set(false);
      },
      error: err => {
        this.error.set(err.error?.message || 'Booking failed. Please try again.');
        this.submitting.set(false);
      }
    });
  }

  formatDuration(mins: number) { return `${Math.floor(mins/60)}h ${mins%60}m`; }

  goToDashboard() { this.router.navigate(['/dashboard']); }
  goHome()        { this.router.navigate(['/']); }
}
