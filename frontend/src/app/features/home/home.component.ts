import {
  Component, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, HostListener, signal
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AirportAutocompleteComponent } from '../../shared/components/airport-autocomplete/airport-autocomplete.component';
import { Airport } from '../../core/models/airport.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, AirportAutocompleteComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') particleCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fromInput') fromRef!: AirportAutocompleteComponent;
  @ViewChild('toInput')   toRef!: AirportAutocompleteComponent;

  // ─── Top-level booking tab ─────────────────────────────────────────────────
  bookingTab = signal<'flights'|'cars'>('flights');

  // ─── Flight form state ─────────────────────────────────────────────────────
  tripType    = signal<'one-way'|'round-trip'>('one-way');
  flightClass = signal('Economy');
  passengers  = signal(1);
  departDate  = signal('');
  returnDate  = signal('');
  fromAirport = signal<Airport | null>(null);
  toAirport   = signal<Airport | null>(null);

  // ─── Car form state (plain properties — easier with ngModel) ──────────────
  carPickup      = '';
  carDropoff     = '';
  carPickupDate  = '';
  carReturnDate  = '';
  carType        = signal('Economy');

  scrollY = signal(0);

  // ─── Particles ─────────────────────────────────────────────────────────────
  private pCtx!: CanvasRenderingContext2D;
  private particles: Array<{x:number;y:number;vx:number;vy:number;r:number;op:number;gold:boolean;sparkle:number;phase:number}> = [];
  private pAnimId!: number;
  private pTick = 0;

  // ─── Static data ───────────────────────────────────────────────────────────
  readonly airlines = [
    { name: 'Emirates' },     { name: 'Qatar Airways' },
    { name: 'Singapore Air' }, { name: 'Lufthansa' },
    { name: 'British Airways' },{ name: 'United Airlines' },
    { name: 'Air France' },    { name: 'Cathay Pacific' },
    { name: 'Turkish Airlines' },{ name: 'Delta' },
    { name: 'Etihad Airways' }, { name: 'American Airlines' }
  ];

  readonly popularRoutes = [
    { from:'New York', to:'London',    fromIata:'JFK', toIata:'LHR', price:299, img:'🗼' },
    { from:'Dubai',    to:'Singapore', fromIata:'DXB', toIata:'SIN', price:199, img:'🌆' },
    { from:'LA',       to:'Tokyo',     fromIata:'LAX', toIata:'NRT', price:449, img:'🗾' },
    { from:'London',   to:'Sydney',    fromIata:'LHR', toIata:'SYD', price:699, img:'🦘' },
    { from:'Paris',    to:'Dubai',     fromIata:'CDG', toIata:'DXB', price:349, img:'🗼' },
    { from:'Singapore',to:'Tokyo',     fromIata:'SIN', toIata:'NRT', price:259, img:'🌸' },
  ] as const;

  readonly featuredCars = [
    { name: 'Economy Compact', type: 'Economy', emoji: '🚗', price: 29 },
    { name: 'Honda CR-V',      type: 'SUV',     emoji: '🚙', price: 59 },
    { name: 'BMW 5 Series',    type: 'Business',emoji: '🚘', price: 99 },
    { name: 'Rolls Royce',     type: 'Luxury',  emoji: '🏎️', price: 349 },
  ];

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.setMinDate();
    this.initParticles();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.pAnimId);
  }

  @HostListener('window:scroll')
  onScroll() { this.scrollY.set(window.scrollY); }

  @HostListener('window:resize')
  onResize() { this.resizeParticleCanvas(); }

  // ─── Particles ─────────────────────────────────────────────────────────────
  initParticles() {
    const canvas = this.particleCanvas.nativeElement;
    this.pCtx = canvas.getContext('2d')!;
    this.resizeParticleCanvas();

    for (let i = 0; i < 180; i++) {
      const layer = i < 60 ? 0 : i < 130 ? 1 : 2;
      const speed = [0.15, 0.28, 0.45][layer];
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r:  [0.4, 1.0, 1.8][layer] + Math.random() * [0.6, 0.8, 1.2][layer],
        op: [0.18, 0.35, 0.55][layer] + Math.random() * 0.15,
        gold: Math.random() > (layer === 0 ? 0.8 : 0.55),
        sparkle: 0,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      this.pAnimId = requestAnimationFrame(draw);
      const { width: W, height: H } = canvas;
      this.pCtx.clearRect(0, 0, W, H);
      this.pTick++;

      this.pCtx.lineWidth = 0.5;
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const alpha = (1 - dist / 90) * 0.12;
            this.pCtx.strokeStyle = `rgba(212,160,23,${alpha})`;
            this.pCtx.beginPath();
            this.pCtx.moveTo(this.particles[i].x, this.particles[i].y);
            this.pCtx.lineTo(this.particles[j].x, this.particles[j].y);
            this.pCtx.stroke();
          }
        }
      }

      const waveT = this.pTick * 0.008;
      this.particles.forEach(p => {
        p.x += p.vx + Math.sin(waveT + p.phase) * 0.18;
        p.y += p.vy + Math.cos(waveT * 0.7 + p.phase * 1.3) * 0.14;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        if (Math.random() < 0.0008) p.sparkle = 1;
        if (p.sparkle > 0) p.sparkle -= 0.04;

        const radius  = p.r * (1 + Math.max(0, p.sparkle) * 2.5);
        const opacity = p.op * (1 + Math.max(0, p.sparkle) * 0.8);

        if (p.gold) {
          this.pCtx.beginPath();
          this.pCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          this.pCtx.fillStyle = `rgba(212,160,23,${opacity})`;
          this.pCtx.fill();
          if (p.sparkle > 0.3) {
            this.pCtx.beginPath();
            this.pCtx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
            this.pCtx.fillStyle = `rgba(245,200,66,${p.sparkle * 0.15})`;
            this.pCtx.fill();
          }
        } else {
          this.pCtx.beginPath();
          this.pCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          this.pCtx.fillStyle = `rgba(255,255,255,${opacity * 0.55})`;
          this.pCtx.fill();
        }
      });

      if (this.pTick % 180 === 0) this.spawnStreak(W, H);
    };
    draw();
  }

  private spawnStreak(W: number, H: number) {
    const y = Math.random() * H * 0.7, len = 150 + Math.random() * 200;
    let x = -len;
    const step = () => {
      if (x > W + len) return;
      const g = this.pCtx.createLinearGradient(x, y, x + len, y);
      g.addColorStop(0, 'rgba(212,160,23,0)');
      g.addColorStop(0.5, 'rgba(212,160,23,0.35)');
      g.addColorStop(1, 'rgba(212,160,23,0)');
      this.pCtx.strokeStyle = g;
      this.pCtx.lineWidth = 1;
      this.pCtx.beginPath();
      this.pCtx.moveTo(x, y); this.pCtx.lineTo(x + len, y);
      this.pCtx.stroke();
      x += 10;
      requestAnimationFrame(step);
    };
    step();
  }

  private resizeParticleCanvas() {
    const c = this.particleCanvas.nativeElement;
    c.width = window.innerWidth; c.height = window.innerHeight;
  }

  // ─── Flight form ───────────────────────────────────────────────────────────
  setMinDate() {
    const d = new Date(); d.setDate(d.getDate() + 1);
    this.departDate.set(d.toISOString().split('T')[0]);
    this.carPickupDate = d.toISOString().split('T')[0];
    const r = new Date(d); r.setDate(r.getDate() + 3);
    this.carReturnDate = r.toISOString().split('T')[0];
  }

  swapAirports() {
    const f = this.fromAirport(), t = this.toAirport();
    this.fromAirport.set(t); this.toAirport.set(f);
    if (t) this.fromRef.setValue(t.iata, t.city);
    if (f) this.toRef.setValue(f.iata, f.city);
  }

  adjustPassengers(d: number) { this.passengers.update(p => Math.max(1, Math.min(9, p + d))); }

  search() {
    const from = this.fromAirport(), to = this.toAirport();
    if (!from || !to || !this.departDate()) return;
    this.router.navigate(['/flights/search'], { queryParams: {
      from: from.iata, to: to.iata,
      date: this.departDate(),
      passengers: this.passengers(),
      class: this.flightClass()
    }});
  }

  quickSearch(fromIata: string, toIata: string) {
    const d = new Date(); d.setDate(d.getDate() + 7);
    this.router.navigate(['/flights/search'], { queryParams: {
      from: fromIata, to: toIata,
      date: d.toISOString().split('T')[0],
      passengers: 1, class: 'Economy'
    }});
  }

  // ─── Car form ──────────────────────────────────────────────────────────────
  swapCarLocations() {
    const tmp = this.carPickup;
    this.carPickup = this.carDropoff;
    this.carDropoff = tmp;
  }

  searchCars() {
    this.router.navigate(['/cars'], { queryParams: {
      pickup:   this.carPickup  || 'Airport',
      dropoff:  this.carDropoff || 'Hotel',
      from:     this.carPickupDate,
      to:       this.carReturnDate,
      type:     this.carType(),
      pax:      this.passengers(),
    }});
  }

  goToCars() {
    this.router.navigate(['/cars']);
  }
}
