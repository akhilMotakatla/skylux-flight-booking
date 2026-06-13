import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface CarListing {
  id: number;
  name: string;
  brand: string;
  category: string;
  emoji: string;
  seats: number;
  bags: number;
  transmission: 'Auto' | 'Manual';
  fuel: string;
  pricePerDay: number;
  rating: number;
  reviews: number;
  features: string[];
  color: string;
  available: boolean;
}

@Component({
  selector: 'app-car-search',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="car-page">

      <!-- Ambient glow bg -->
      <div class="car-bg"></div>

      <!-- ── Header bar ─────────────────────────────────────────────────── -->
      <div class="car-header">
        <div class="container car-header-inner">
          <button class="back-btn" (click)="goHome()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Home
          </button>
          <div class="car-title-group">
            <h1 class="car-page-title">🚗 Airport <span class="accent">Car Rental</span></h1>
            <p class="car-page-sub">{{ filteredCars().length }} vehicles available · Pickup from {{ pickup || 'Airport' }}</p>
          </div>
        </div>
      </div>

      <!-- ── Filter bar ─────────────────────────────────────────────────── -->
      <div class="filter-bar">
        <div class="container filter-inner">
          <div class="filter-chips">
            <span class="filter-label">Filter:</span>
            @for (cat of categories; track cat) {
              <button class="chip" [class.active]="activeCategory() === cat"
                      (click)="activeCategory.set(cat)">{{ cat }}</button>
            }
          </div>
          <div class="sort-row">
            <label class="sort-label">Sort by:</label>
            <select class="sort-select" [(ngModel)]="sortBy" (ngModelChange)="onSort()">
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ── Results grid ───────────────────────────────────────────────── -->
      <div class="container results-container">

        <!-- Summary bar -->
        <div class="results-meta">
          <span>{{ filteredCars().length }} results</span>
          <span class="meta-sep">·</span>
          <span>{{ pickup || 'Airport' }} → {{ dropoff || 'Destination' }}</span>
          <span class="meta-sep">·</span>
          <span>{{ from }} – {{ to }}</span>
        </div>

        <div class="cars-grid">
          @for (car of filteredCars(); track car.id; let i = $index) {
            <div class="car-card" [style.--delay]="i * 80 + 'ms'" [class.unavailable]="!car.available">

              <!-- Color accent stripe -->
              <div class="car-stripe" [style.background]="car.color"></div>

              <!-- Card header -->
              <div class="car-card-header">
                <div class="car-emoji-wrap">
                  <span class="car-emoji">{{ car.emoji }}</span>
                  <div class="car-glow" [style.background]="car.color + '33'"></div>
                </div>
                <div class="car-meta">
                  <span class="car-category">{{ car.category }}</span>
                  <h3 class="car-name">{{ car.brand }} {{ car.name }}</h3>
                  <div class="car-rating">
                    <span class="stars">★</span>
                    <span class="rating-val">{{ car.rating }}</span>
                    <span class="rating-cnt">({{ car.reviews }} reviews)</span>
                  </div>
                </div>
              </div>

              <!-- Specs row -->
              <div class="car-specs">
                <div class="spec">
                  <span class="spec-icon">👥</span>
                  <span>{{ car.seats }} seats</span>
                </div>
                <div class="spec">
                  <span class="spec-icon">🧳</span>
                  <span>{{ car.bags }} bags</span>
                </div>
                <div class="spec">
                  <span class="spec-icon">⚙️</span>
                  <span>{{ car.transmission }}</span>
                </div>
                <div class="spec">
                  <span class="spec-icon">⛽</span>
                  <span>{{ car.fuel }}</span>
                </div>
              </div>

              <!-- Features -->
              <div class="car-features">
                @for (f of car.features; track f) {
                  <span class="feat-tag">{{ f }}</span>
                }
              </div>

              <!-- Price + CTA -->
              <div class="car-footer">
                <div class="car-price">
                  <span class="price-from">from</span>
                  <span class="price-amt">\${{ car.pricePerDay }}</span>
                  <span class="price-unit">/day</span>
                </div>
                @if (car.available) {
                  <button class="btn-book" (click)="bookCar(car)">
                    Book Now
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                } @else {
                  <span class="sold-out">Sold Out</span>
                }
              </div>

            </div>
          }
        </div>

        @if (filteredCars().length === 0) {
          <div class="no-results">
            <span class="no-emoji">🚗</span>
            <h3>No cars in this category</h3>
            <p>Try selecting "All" to see all available vehicles.</p>
            <button class="btn-gold" (click)="activeCategory.set('All')">Show All Cars</button>
          </div>
        }

      </div>

      <!-- ── Why rent section ───────────────────────────────────────────── -->
      <section class="why-rent section-padding">
        <div class="container">
          <h2 class="section-title text-center">Why Rent with <span class="accent">SkyLux?</span></h2>
          <div class="gold-divider" style="margin: 1rem auto 2.5rem;"></div>
          <div class="why-grid">
            <div class="why-card glass-card">
              <span class="why-icon">⚡</span>
              <h4>Instant Confirmation</h4>
              <p>Book in under 60 seconds. Confirmation sent to your email immediately.</p>
            </div>
            <div class="why-card glass-card">
              <span class="why-icon">🔓</span>
              <h4>Free Cancellation</h4>
              <p>Change of plans? Cancel for free up to 24 hours before pickup.</p>
            </div>
            <div class="why-card glass-card">
              <span class="why-icon">🛡️</span>
              <h4>Full Insurance</h4>
              <p>All rentals include comprehensive collision and theft protection.</p>
            </div>
            <div class="why-card glass-card">
              <span class="why-icon">🤝</span>
              <h4>Meet & Greet</h4>
              <p>Chauffeur meets you at arrivals with a name board. No queues.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    @import '../../../styles/variables';

    .car-page {
      min-height: 100vh;
      position: relative;
      padding-top: 74px;
    }

    .car-bg {
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 70% 50% at 20% 30%, rgba(34,211,238,0.04) 0%, transparent 55%),
        radial-gradient(ellipse 60% 50% at 80% 70%, rgba(139,92,246,0.04) 0%, transparent 55%),
        linear-gradient(180deg, #020814 0%, #01040c 100%);
      z-index: -1;
      pointer-events: none;
    }

    .car-header {
      background: rgba(2,8,20,0.94);
      border-bottom: 1px solid rgba(255,255,255,0.07);
      backdrop-filter: blur(20px);
      padding: 1.5rem 0;
    }

    .car-header-inner {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 50px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.7);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;
      white-space: nowrap;
      flex-shrink: 0;

      &:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
        transform: translateX(-3px);
      }

      svg { transition: transform 0.25s ease; }
      &:hover svg { transform: translateX(-3px); }
    }

    .car-page-title {
      font-size: clamp(1.4rem, 3vw, 2.2rem);
      font-weight: 900;
      color: #fff;
      margin-bottom: 4px;
    }

    .accent {
      background: linear-gradient(135deg, #22d3ee, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .car-page-sub {
      font-size: 14px;
      color: rgba(255,255,255,0.5);
    }

    // Filter bar
    .filter-bar {
      background: rgba(4,10,24,0.90);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(16px);
      padding: 1rem 0;
      position: sticky;
      top: 74px;
      z-index: 100;
    }

    .filter-inner {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .filter-chips {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      flex: 1;
    }

    .filter-label, .sort-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.35);
    }

    .chip {
      padding: 6px 16px;
      border-radius: 50px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.6);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover { border-color: rgba(34,211,238,0.3); color: #22d3ee; }
      &.active {
        background: rgba(34,211,238,0.1);
        border-color: rgba(34,211,238,0.4);
        color: #22d3ee;
        box-shadow: 0 0 14px rgba(34,211,238,0.12);
      }
    }

    .sort-row { display: flex; align-items: center; gap: 0.75rem; }

    .sort-select {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      color: rgba(255,255,255,0.8);
      font-size: 13px;
      padding: 7px 12px;
      cursor: pointer;
      outline: none;

      option { background: #020814; }
    }

    // Results
    .results-container { padding: 2rem 0 4rem; }

    .results-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      margin-bottom: 1.5rem;
    }

    .meta-sep { color: rgba(255,255,255,0.2); }

    .cars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;

      @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 680px)  { grid-template-columns: 1fr; }
    }

    // Car card
    .car-card {
      position: relative;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 16px;
      padding: 1.5rem;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      animation: card-reveal var(--delay, 0ms) ease both;
      animation-duration: 0.5s;
      animation-delay: var(--delay, 0ms);
      animation-fill-mode: both;

      &:hover:not(.unavailable) {
        transform: perspective(1000px) rotateX(-2deg) translateY(-8px) scale(1.01);
        border-color: rgba(34,211,238,0.28);
        box-shadow:
          0 24px 60px rgba(0,0,0,0.6),
          0 0 24px rgba(34,211,238,0.1);
        background: rgba(255,255,255,0.07);

        .car-stripe { opacity: 0.9; }
        .car-emoji { transform: scale(1.15) rotate(-5deg); }
      }

      &.unavailable { opacity: 0.5; filter: grayscale(0.4); }
    }

    @keyframes card-reveal {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .car-stripe {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }

    .car-card-header {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 1.2rem;
    }

    .car-emoji-wrap {
      position: relative;
      width: 60px; height: 60px;
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }

    .car-emoji {
      font-size: 36px;
      display: block;
      transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      position: relative; z-index: 1;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
    }

    .car-glow {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      filter: blur(12px);
    }

    .car-category {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #22d3ee;
      margin-bottom: 4px;
      display: block;
    }

    .car-name {
      font-size: 17px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }

    .car-rating {
      display: flex; align-items: center; gap: 5px;
      font-size: 13px;

      .stars { color: #f5c842; }
      .rating-val { color: #fff; font-weight: 600; }
      .rating-cnt { color: rgba(255,255,255,0.4); }
    }

    .car-specs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      padding: 1rem 0;
      border-top: 1px solid rgba(255,255,255,0.06);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      margin-bottom: 1rem;
    }

    .spec {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      font-size: 11px; color: rgba(255,255,255,0.5); text-align: center;

      .spec-icon { font-size: 15px; }
    }

    .car-features {
      display: flex; flex-wrap: wrap; gap: 6px;
      margin-bottom: 1.2rem;
    }

    .feat-tag {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 4px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.55);
    }

    .car-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .car-price {
      display: flex; align-items: baseline; gap: 4px;

      .price-from { font-size: 11px; color: rgba(255,255,255,0.4); }
      .price-amt {
        font-size: 26px;
        font-weight: 900;
        background: linear-gradient(135deg, #f5c842, #d4a017);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .price-unit { font-size: 12px; color: rgba(255,255,255,0.4); }
    }

    .btn-book {
      display: flex; align-items: center; gap: 8px;
      padding: 11px 20px;
      border-radius: 50px;
      background: linear-gradient(135deg, #22d3ee, #8b5cf6);
      border: none;
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
      white-space: nowrap;

      &:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 8px 24px rgba(34,211,238,0.35);
      }

      svg { stroke: #fff; }
    }

    .sold-out {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,0.3);
      padding: 10px 16px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 50px;
    }

    // No results
    .no-results {
      text-align: center;
      padding: 4rem 0;

      .no-emoji { font-size: 64px; display: block; margin-bottom: 1rem; }
      h3 { font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem; }
      p { color: rgba(255,255,255,0.5); margin-bottom: 1.5rem; }
    }

    // Why rent
    .why-rent {
      background: rgba(4,10,22,0.92);
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .text-center { text-align: center; }

    .why-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;

      @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 500px) { grid-template-columns: 1fr; }
    }

    .why-card {
      padding: 1.75rem 1.5rem;
      text-align: center;
      transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);

      &:hover {
        transform: translateY(-8px);
        border-color: rgba(34,211,238,0.25);
        box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(34,211,238,0.08);
      }

      .why-icon { font-size: 38px; display: block; margin-bottom: 1rem; }
      h4 { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 0.6rem; }
      p  { font-size: 13px; line-height: 1.65; color: rgba(255,255,255,0.5); }
    }

    // Global helpers re-used from styles.scss
    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .section-padding { padding: 5rem 0; }

    .section-title {
      font-size: clamp(1.8rem, 3.5vw, 2.6rem);
      font-weight: 900;
      color: #fff;
      margin-bottom: 0;
      font-family: 'Playfair Display', serif;
    }

    .gold-divider {
      height: 2px;
      width: 60px;
      background: linear-gradient(90deg, #d4a017, #f5c842);
      border-radius: 2px;
    }

    .glass-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 16px;
      backdrop-filter: blur(12px);
    }

    .btn-gold {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      border-radius: 50px;
      background: linear-gradient(135deg, #d4a017, #f5c842);
      border: none;
      color: #020814;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,160,23,0.45); }
    }
  `]
})
export class CarSearchComponent implements OnInit {
  pickup  = '';
  dropoff = '';
  from    = '';
  to      = '';
  sortBy  = 'price-asc';

  activeCategory = signal('All');

  readonly categories = ['All', 'Economy', 'Compact', 'SUV', 'Business', 'Luxury', 'Sports'];

  readonly allCars: CarListing[] = [
    {
      id: 1, name: 'Corolla', brand: 'Toyota', category: 'Economy',
      emoji: '🚗', seats: 5, bags: 2, transmission: 'Auto', fuel: 'Petrol',
      pricePerDay: 29, rating: 4.6, reviews: 1240,
      features: ['A/C', 'Bluetooth', 'USB'],
      color: 'linear-gradient(135deg,#22d3ee,#0891b2)', available: true,
    },
    {
      id: 2, name: 'Polo', brand: 'Volkswagen', category: 'Compact',
      emoji: '🚙', seats: 5, bags: 2, transmission: 'Manual', fuel: 'Diesel',
      pricePerDay: 39, rating: 4.4, reviews: 876,
      features: ['A/C', 'GPS', 'Heated Seats'],
      color: 'linear-gradient(135deg,#a78bfa,#7c3aed)', available: true,
    },
    {
      id: 3, name: 'CR-V', brand: 'Honda', category: 'SUV',
      emoji: '🚐', seats: 7, bags: 4, transmission: 'Auto', fuel: 'Hybrid',
      pricePerDay: 59, rating: 4.8, reviews: 2103,
      features: ['A/C', 'GPS', 'Leather', 'Sunroof'],
      color: 'linear-gradient(135deg,#34d399,#059669)', available: true,
    },
    {
      id: 4, name: '5 Series', brand: 'BMW', category: 'Business',
      emoji: '🚘', seats: 5, bags: 3, transmission: 'Auto', fuel: 'Petrol',
      pricePerDay: 99, rating: 4.9, reviews: 543,
      features: ['A/C', 'GPS', 'Leather', 'Ambient Lighting', 'Sunroof'],
      color: 'linear-gradient(135deg,#f59e0b,#d97706)', available: true,
    },
    {
      id: 5, name: 'Range Rover', brand: 'Land Rover', category: 'Luxury',
      emoji: '🏎️', seats: 5, bags: 4, transmission: 'Auto', fuel: 'Hybrid',
      pricePerDay: 199, rating: 4.9, reviews: 287,
      features: ['A/C', 'GPS', 'Massage Seats', 'Panoramic Roof', 'Surround Sound'],
      color: 'linear-gradient(135deg,#fb923c,#dc2626)', available: true,
    },
    {
      id: 6, name: 'Phantom', brand: 'Rolls-Royce', category: 'Luxury',
      emoji: '👑', seats: 4, bags: 3, transmission: 'Auto', fuel: 'Petrol',
      pricePerDay: 499, rating: 5.0, reviews: 94,
      features: ['Chauffeur', 'Champagne Bar', 'Starlight Roof', 'Stargazer Seats'],
      color: 'linear-gradient(135deg,#fde68a,#d4a017)', available: true,
    },
    {
      id: 7, name: '911 Carrera', brand: 'Porsche', category: 'Sports',
      emoji: '🏁', seats: 2, bags: 1, transmission: 'Auto', fuel: 'Petrol',
      pricePerDay: 299, rating: 4.9, reviews: 178,
      features: ['Sport Mode', 'Launch Control', 'Carbon Ceramic Brakes'],
      color: 'linear-gradient(135deg,#f472b6,#be185d)', available: true,
    },
    {
      id: 8, name: 'Model 3', brand: 'Tesla', category: 'Compact',
      emoji: '⚡', seats: 5, bags: 3, transmission: 'Auto', fuel: 'Electric',
      pricePerDay: 79, rating: 4.8, reviews: 1541,
      features: ['Autopilot', 'Full Self-Driving', 'OTA Updates', 'Supercharger'],
      color: 'linear-gradient(135deg,#67e8f9,#0e7490)', available: false,
    },
    {
      id: 9, name: 'E-Class', brand: 'Mercedes', category: 'Business',
      emoji: '🌟', seats: 5, bags: 3, transmission: 'Auto', fuel: 'Diesel',
      pricePerDay: 119, rating: 4.8, reviews: 634,
      features: ['A/C', 'Widescreen Display', 'Leather', 'Ambient Light'],
      color: 'linear-gradient(135deg,#c084fc,#9333ea)', available: true,
    },
  ];

  private sortedCars: CarListing[] = [...this.allCars];

  filteredCars = computed(() => {
    const cat = this.activeCategory();
    return this.sortedCars.filter(c => cat === 'All' || c.category === cat);
  });

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      this.pickup  = p['pickup']  || '';
      this.dropoff = p['dropoff'] || '';
      this.from    = p['from']    || '';
      this.to      = p['to']      || '';
    });
    this.onSort();
  }

  onSort() {
    this.sortedCars = [...this.allCars].sort((a, b) => {
      if (this.sortBy === 'price-asc')  return a.pricePerDay - b.pricePerDay;
      if (this.sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      return b.rating - a.rating;
    });
  }

  bookCar(car: CarListing) {
    alert(`Booking ${car.brand} ${car.name} — $${car.pricePerDay}/day\n\nThis would open the booking wizard in a full implementation.`);
  }

  goHome() { this.router.navigate(['/']); }
}
