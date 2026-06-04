import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ChatbotComponent } from './layout/chatbot/chatbot.component';
import { AirportBackgroundComponent } from './layout/airport-background/airport-background.component';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ChatbotComponent, AirportBackgroundComponent],
  template: `
    <!-- 3D Airport Background (z-index: 0, behind everything) -->
    <app-airport-background />

    <!-- Loading bar -->
    @if (loading.isLoading()) {
      <div class="progress-bar" style="width:80%"></div>
    }

    <!-- App shell -->
    <app-navbar />
    <main class="main-content">
      <router-outlet />
    </main>
    <app-footer />
    <app-chatbot />
  `,
  styles: [`
    :host { display: block; position: relative; }
    .main-content { position: relative; z-index: 1; min-height: 100vh; }
  `]
})
export class App {
  constructor(public loading: LoadingService) {}
}
