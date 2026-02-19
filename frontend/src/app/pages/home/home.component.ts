import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styles: [`
    .hero {
      padding: 6rem 0 4rem;
      text-align: center;
    }
    .hero-eyebrow {
      font-family: 'JetBrains Mono', monospace;
      color: var(--accent);
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
    }
    .hero h1 { margin-bottom: 1rem; }
    .hero-sub {
      color: var(--text-secondary);
      font-size: 1.1rem;
      max-width: 52ch;
      margin: 0 auto 2rem;
    }
    .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

    .section-title {
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .section-title a { font-size: 0.9rem; }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 4rem;
    }
    .post-card {
      cursor: pointer;
      text-decoration: none;
      display: block;
    }
    .post-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      font-family: 'JetBrains Mono', monospace;
    }
    .post-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    .post-summary { color: var(--text-secondary); font-size: 0.9rem; }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 4rem;
    }
    .skill-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 1.25rem;
      text-align: center;
    }
    .skill-icon { font-size: 1.75rem; margin-bottom: 0.5rem; }
    .skill-name { font-weight: 600; font-size: 0.95rem; }
    .skill-level { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }
  `],
})
export class HomeComponent implements OnInit {
  recentPosts: BlogPost[] = [];
  loading = true;

  skills = [
    { icon: '⚙️', name: 'Backend', level: 'Python · Flask · REST' },
    { icon: '🎨', name: 'Frontend', level: 'Angular · TypeScript' },
    { icon: '🐳', name: 'DevOps', level: 'Docker · Nginx · Linux' },
    { icon: '🗄️', name: 'Databases', level: 'SQLite · PostgreSQL' },
    { icon: '🍓', name: 'Hardware', level: 'Raspberry Pi · Self-hosted' },
    { icon: '🔐', name: 'Security', level: 'TLS · Firewalls · SSH' },
  ];

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.blogService.getPosts(true).subscribe({
      next: (posts) => {
        this.recentPosts = posts.slice(0, 3);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
