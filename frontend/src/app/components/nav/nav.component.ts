import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container nav-inner">
        <a routerLink="/" class="nav-brand">
          <span class="brand-bracket">&lt;</span>
          dev
          <span class="brand-bracket">/&gt;</span>
        </a>
        <ul class="nav-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a></li>
          <li><a routerLink="/blog" routerLinkActive="active">Blog</a></li>
          <li><a routerLink="/blog/new" class="btn btn-primary btn-sm">New Post</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      height: 64px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }
    .nav-brand {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      font-size: 1.15rem;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }
    .brand-bracket { color: var(--accent); }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      list-style: none;

      a {
        color: var(--text-secondary);
        padding: 0.4rem 0.75rem;
        border-radius: 0.4rem;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all var(--transition);

        &:hover, &.active {
          color: var(--text-primary);
          background: var(--accent-dim);
        }
      }

      .btn {
        margin-left: 0.5rem;
        padding: 0.4rem 1rem;
        font-size: 0.85rem;
      }
    }
  `],
})
export class NavComponent {}
