import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-list.component.html',
  styles: [`
    .page-header {
      margin-bottom: 3rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 2rem;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .page-header p { color: var(--text-secondary); margin-top: 0.5rem; }

    .post-list { display: flex; flex-direction: column; gap: 1.5rem; }

    .post-item {
      display: block;
      padding: 1.75rem 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      text-decoration: none;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--accent);
        transform: translateX(4px);
      }
    }
    .post-top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .post-date {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .post-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    .post-summary { color: var(--text-secondary); font-size: 0.95rem; }
    .post-arrow {
      margin-top: 1rem;
      color: var(--accent);
      font-size: 0.9rem;
    }

    .controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .toggle-btn {
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      border: 1px solid var(--border-color);
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;

      &.active {
        background: var(--accent-dim);
        border-color: var(--accent);
        color: var(--accent);
      }
    }
  `],
})
export class BlogListComponent implements OnInit {
  posts: BlogPost[] = [];
  loading = true;
  showAll = false;

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.blogService.getPosts(!this.showAll).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
    this.loadPosts();
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  deletePost(event: Event, post: BlogPost) {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`Delete "${post.title}"?`)) return;
    this.blogService.deletePost(post.id).subscribe(() => {
      this.posts = this.posts.filter((p) => p.id !== post.id);
    });
  }
}
