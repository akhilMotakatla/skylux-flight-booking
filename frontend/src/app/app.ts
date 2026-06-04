import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ChatbotComponent } from './layout/chatbot/chatbot.component';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ChatbotComponent],
  template: `
    @if (loading.isLoading()) {
      <div class="progress-bar" style="width: 80%"></div>
    }
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
    <app-chatbot />
  `,
  styles: [`
    main { min-height: 100vh; }
  `]
})
export class App {
  constructor(public loading: LoadingService) {}
}
