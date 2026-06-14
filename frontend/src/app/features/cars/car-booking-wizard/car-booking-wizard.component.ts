import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { CarService } from '../../../core/services/car.service';

interface CarListing {
  id: number; name: string; brand: string; category: string; emoji: string;
  seats: number; bags: number; transmission: string; fuel: string;
  pricePerDay: number; rating: number; reviews: number;
  features: string[]; color: string; available: boolean;
}

@Component({
  selector: 'app-car-booking-wizard',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './car-booking-wizard.component.html',
  styleUrl: './car-booking-wizard.component.scss'
})
export class CarBookingWizardComponent implements OnInit {
  step      = signal(1);
  loading   = signal(true);
  submitting = signal(false);
  error     = signal('');
  bookingRef = signal('');
  cardFlipped = signal(false);

  car: CarListing | null = null;
  pickupLocation  = '';
  dropoffLocation = '';
  pickupDate  = '';
  returnDate  = '';
  days = 1;

  form!: FormGroup;

  readonly addOnOptions = [
    { id: 'gps',          icon: '🗺️', label: 'GPS Navigation',        price: 8  },
    { id: 'extra_driver', icon: '👤',        label: 'Additional Driver',     price: 15 },
    { id: 'child_seat',   icon: '🪑',        label: 'Child Safety Seat',     price: 10 },
    { id: 'baby_seat',    icon: '👶',        label: 'Infant Baby Seat',      price: 8  },
    { id: 'wifi',         icon: '📶',        label: 'In-Car WiFi Hotspot',   price: 12 },
    { id: 'collision',    icon: '🛡️',  label: 'Collision Insurance',   price: 20 },
    { id: 'full_cover',   icon: '🔐',        label: 'Full Coverage Plan',    price: 35 },
    { id: 'roadside',     icon: '🔧',        label: 'Roadside Assistance',   price: 5  },
  ];

  selectedAddOns = signal<Set<string>>(new Set());

  cardNumber = '';
  cardExpiry = '';
  cardCvv    = '';
  cardName   = '';

  get cardType(): 'visa' | 'mastercard' | 'amex' | 'discover' | '' {
    const d = this.cardNumber.replace(/\s/g, '');
    if (!d) return '';
    if (d[0] === '4') return 'visa';
    if (d[0] === '5') return 'mastercard';
    if (d[0] === '3') return 'amex';
    if (d[0] === '6') return 'discover';
    return '';
  }

  get basePrice():   number { return (this.car?.pricePerDay ?? 0) * this.days; }
  get addOnsTotal(): number {
    let total = 0;
    for (const id of this.selectedAddOns()) {
      const ao = this.addOnOptions.find(a => a.id === id);
      if (ao) total += ao.price * this.days;
    }
    return total;
  }
  get totalPrice(): number { return this.basePrice + this.addOnsTotal; }

  selectedAddOnsArray(): string[] { return [...this.selectedAddOns()]; }
  getAddOn(id: string) { return this.addOnOptions.find(a => a.id === id) ?? null; }

  readonly countries = [
    'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bahrain',
    'Bangladesh','Belgium','Brazil','Canada','Chile','China','Colombia','Croatia',
    'Czech Republic','Denmark','Egypt','Ethiopia','Finland','France','Germany',
    'Ghana','Greece','Hungary','India','Indonesia','Iran','Iraq','Ireland',
    'Israel','Italy','Japan','Jordan','Kenya','Kuwait','Lebanon','Malaysia',
    'Mexico','Morocco','Netherlands','New Zealand','Nigeria','Norway','Oman',
    'Pakistan','Peru','Philippines','Poland','Portugal','Qatar','Romania',
    'Russia','Saudi Arabia','Singapore','South Africa','South Korea','Spain',
    'Sri Lanka','Sweden','Switzerland','Thailand','Turkey','UAE','UK','Ukraine',
    'United States','Vietnam','Zimbabwe'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private carService: CarService
  ) {}

  ngOnInit() {
    const stored = sessionStorage.getItem('bookingCar');
    if (stored) {
      sessionStorage.removeItem('bookingCar');
      this.car = JSON.parse(stored);
    }

    const q = this.route.snapshot.queryParamMap;
    this.pickupLocation  = q.get('pickup')  ?? '';
    this.dropoffLocation = q.get('dropoff') ?? '';
    this.pickupDate      = q.get('from')    ?? '';
    this.returnDate      = q.get('to')      ?? '';

    if (this.pickupDate && this.returnDate) {
      const d1 = new Date(this.pickupDate + 'T00:00:00');
      const d2 = new Date(this.returnDate + 'T00:00:00');
      const diff = Math.ceil((d2.getTime() - d1.getTime()) / 86400000);
      this.days = diff > 0 ? diff : 1;
    }

    this.buildForm();
    this.loading.set(false);
  }

  private buildForm() {
    this.form = this.fb.group({
      title:         ['Mr'],
      firstName:     ['', Validators.required],
      lastName:      ['', Validators.required],
      email:         ['', [Validators.required, Validators.email]],
      mobile:        ['', Validators.required],
      licenseNumber: ['', Validators.required],
      dateOfBirth:   ['', Validators.required],
      nationality:   ['', Validators.required],
    });
  }

  toggleAddOn(id: string) {
    const s = new Set(this.selectedAddOns());
    s.has(id) ? s.delete(id) : s.add(id);
    this.selectedAddOns.set(s);
  }

  isAddOnSelected(id: string) { return this.selectedAddOns().has(id); }

  nextStep() {
    if (this.step() === 1 && this.form.invalid) {
      this.form.markAllAsTouched(); return;
    }
    if (this.step() === 3) {
      if (!this.isCardValid()) return;
      this.confirm(); return;
    }
    this.step.update(s => s + 1);
  }

  prevStep() { this.step.update(s => Math.max(1, s - 1)); }

  onCardNumberInput(e: Event) {
    const el = e.target as HTMLInputElement;
    const raw = el.value.replace(/\D/g, '').slice(0, 16);
    const fmt = raw.replace(/(.{4})/g, '$1 ').trim();
    this.cardNumber = fmt; el.value = fmt;
  }

  onExpiryInput(e: Event) {
    const el = e.target as HTMLInputElement;
    let raw = el.value.replace(/\D/g, '');
    if (raw.length > 4) raw = raw.slice(0, 4);
    if (raw.length >= 2) {
      let mm = parseInt(raw.slice(0, 2));
      if (mm > 12) mm = 12;
      if (mm < 1 && raw.length >= 2) mm = 1;
      raw = mm.toString().padStart(2, '0') + raw.slice(2);
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    this.cardExpiry = raw; el.value = raw;
  }

  onCvvInput(e: Event) {
    const el = e.target as HTMLInputElement;
    const raw = el.value.replace(/\D/g, '').slice(0, this.cardType === 'amex' ? 4 : 3);
    this.cardCvv = raw; el.value = raw;
  }

  onNameInput(e: Event) {
    const el = e.target as HTMLInputElement;
    const raw = el.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    this.cardName = raw; el.value = raw;
  }

  isCardValid(): boolean {
    const num = this.cardNumber.replace(/\s/g, '');
    if (num.length < 13) { this.error.set('Please enter a valid card number (13-16 digits).'); return false; }
    if (!/^\d{2}\/\d{2}$/.test(this.cardExpiry)) { this.error.set('Please enter expiry as MM/YY.'); return false; }
    const cvvLen = this.cardType === 'amex' ? 4 : 3;
    if (this.cardCvv.length < cvvLen) { this.error.set('CVV must be ' + cvvLen + ' digits.'); return false; }
    if (!this.cardName.trim()) { this.error.set('Please enter the cardholder name.'); return false; }
    this.error.set('');
    return true;
  }

  confirm() {
    if (!this.car) return;
    this.submitting.set(true);
    this.error.set('');

    this.carService.createRental({
      carId:           this.car.id,
      pickupLocation:  this.pickupLocation,
      dropoffLocation: this.dropoffLocation,
      pickupDate:      this.pickupDate  || new Date().toISOString().split('T')[0],
      returnDate:      this.returnDate  || new Date().toISOString().split('T')[0],
      driver:          this.form.value,
      addOns:          [...this.selectedAddOns()],
      totalPrice:      this.totalPrice,
      carName:         this.car.brand + ' ' + this.car.name,
      carCategory:     this.car.category,
      carPricePerDay:  this.car.pricePerDay,
      carEmoji:        this.car.emoji,
    }).subscribe({
      next: r => {
        this.bookingRef.set('CAR-' + r.id.toString().padStart(6, '0'));
        this.step.set(4);
        this.submitting.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Booking failed. Please try again.');
        this.submitting.set(false);
      }
    });
  }

  goHome()   { this.router.navigate(['/']); }
  goToCars() { this.router.navigate(['/cars']); }
}
