import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  template: `
    <app-nav />
    <main>
      <router-outlet />
    </main>
    <footer class="site-footer">
      <div class="container">
        <p>Built with Angular &amp; Flask · Self-hosted on Raspberry Pi 4</p>
      </div>
    </footer>
  `,
  styles: [`
    main { min-height: calc(100vh - 64px - 56px); }
    .site-footer {
      border-top: 1px solid var(--border-color);
      padding: 1rem 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
  `],
})
export class AppComponent {}
