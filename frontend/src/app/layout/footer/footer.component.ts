import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <footer class="footer">

      <!-- Animated top border -->
      <div class="footer-glow-bar"></div>

      <!-- Newsletter strip -->
      <div class="newsletter-strip">
        <div class="container newsletter-inner">
          <div class="nl-left">
            <h3 class="nl-title">✈ Exclusive Deals, First Class Prices</h3>
            <p class="nl-sub">Join 2M+ travellers getting weekly luxury travel deals.</p>
          </div>
          <div class="nl-form">
            <div class="nl-input-wrap">
              <input type="email" class="nl-input" placeholder="your@email.com"
                     [(ngModel)]="nlEmail" [class.subscribed]="subscribed()"/>
              <button class="nl-btn" (click)="subscribe()" [disabled]="subscribed()">
                @if (!subscribed()) {
                  <span>Subscribe</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                } @else {
                  <span>✓ Subscribed!</span>
                }
              </button>
            </div>
            <p class="nl-hint">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>

      <!-- Main grid -->
      <div class="container footer-main">
        <div class="footer-grid">

          <!-- Brand -->
          <div class="footer-brand">
            <a routerLink="/" class="footer-logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <defs>
                  <linearGradient id="fLg2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fde68a"/>
                    <stop offset="100%" stop-color="#d4a017"/>
                  </linearGradient>
                </defs>
                <path d="M16 2L28 12H22L28 20H18L16 30L14 20H4L10 12H4L16 2Z" fill="url(#fLg2)"/>
              </svg>
              <span class="fl-sky">Sky</span><span class="fl-lux">Lux</span>
            </a>
            <p class="brand-tagline">Your gateway to the world. Premium travel experiences crafted for the discerning explorer.</p>
            <div class="socials">
              <a href="#" class="social-btn" aria-label="X">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.23H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" class="social-btn" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="#" class="social-btn" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" class="social-btn social-btn--yt" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
              </a>
            </div>
            <div class="trust-row">
              <div class="trust-badge">🔒 SSL Secured</div>
              <div class="trust-badge">✈ IATA Member</div>
            </div>
          </div>

          <!-- Services -->
          <div class="footer-col">
            <h4>Services</h4>
            <a routerLink="/flights/search" class="footer-link"><span class="fl-icon">✈</span>Flights</a>
            <a routerLink="/cars" class="footer-link footer-link--new">
              <span class="fl-icon">🚗</span>Car Rental
              <span class="fl-badge">New</span>
            </a>
            <a href="#" class="footer-link footer-link--soon"><span class="fl-icon">🏨</span>Hotels<span class="fl-badge fl-badge--soon">Soon</span></a>
            <a href="#" class="footer-link footer-link--soon"><span class="fl-icon">🚢</span>Cruises<span class="fl-badge fl-badge--soon">Soon</span></a>
            <a href="#" class="footer-link"><span class="fl-icon">💎</span>Business Class</a>
          </div>

          <!-- Company -->
          <div class="footer-col">
            <h4>Company</h4>
            <a href="#" class="footer-link"><span class="fl-icon">🏢</span>About Us</a>
            <a href="#" class="footer-link"><span class="fl-icon">💼</span>Careers</a>
            <a href="#" class="footer-link"><span class="fl-icon">📰</span>Press</a>
            <a href="#" class="footer-link"><span class="fl-icon">✍</span>Blog</a>
            <a href="#" class="footer-link"><span class="fl-icon">🤝</span>Partners</a>
          </div>

          <!-- Support -->
          <div class="footer-col">
            <h4>Support</h4>
            <a href="#" class="footer-link"><span class="fl-icon">❓</span>Help Centre</a>
            <a href="#" class="footer-link"><span class="fl-icon">📞</span>Contact Us</a>
            <a href="#" class="footer-link"><span class="fl-icon">🔄</span>Cancellations</a>
            <a href="#" class="footer-link"><span class="fl-icon">🧳</span>Baggage Info</a>
            <a href="#" class="footer-link"><span class="fl-icon">⚖️</span>Privacy Policy</a>
          </div>
        </div>

        <!-- Stats bar -->
        <div class="footer-stats">
          <div class="fs-item"><span class="fs-num">200+</span><span class="fs-lbl">Destinations</span></div>
          <div class="fs-divider"></div>
          <div class="fs-item"><span class="fs-num">12</span><span class="fs-lbl">Partner Airlines</span></div>
          <div class="fs-divider"></div>
          <div class="fs-item"><span class="fs-num">2M+</span><span class="fs-lbl">Happy Travellers</span></div>
          <div class="fs-divider"></div>
          <div class="fs-item"><span class="fs-num">24/7</span><span class="fs-lbl">Live Support</span></div>
          <div class="fs-divider"></div>
          <div class="fs-item"><span class="fs-num">4.9★</span><span class="fs-lbl">Avg Rating</span></div>
        </div>

        <!-- Bottom bar -->
        <div class="footer-bottom">
          <p class="copy">© {{ year }} SkyLux Technologies Ltd. All rights reserved.</p>
          <div class="payments">
            <span class="pay-badge">VISA</span>
            <span class="pay-badge">MC</span>
            <span class="pay-badge">AMEX</span>
            <span class="pay-badge">PayPal</span>
            <span class="pay-badge">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  year = new Date().getFullYear();
  nlEmail = '';
  subscribed = signal(false);

  subscribe() {
    if (this.nlEmail.includes('@')) this.subscribed.set(true);
  }
}
