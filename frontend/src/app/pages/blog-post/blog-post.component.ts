import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-post.component.html',
  styles: [`
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 2.5rem;
      transition: color 0.2s;

      &:hover { color: var(--accent); }
    }

    .post-header { margin-bottom: 3rem; }
    .post-meta {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .post-title {
      font-size: clamp(1.75rem, 4vw, 2.75rem);
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.15;
    }
    .post-summary {
      font-size: 1.1rem;
      color: var(--text-secondary);
      border-left: 3px solid var(--accent);
      padding-left: 1rem;
    }

    .post-content {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 2.5rem;
    }

    .error-state {
      text-align: center;
      padding: 6rem 1rem;
      color: var(--text-muted);
    }
  `],
})
export class BlogPostComponent implements OnInit {
  post?: BlogPost;
  renderedContent: SafeHtml = '';
  loading = true;
  error = false;

  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.blogService.getPost(slug).subscribe({
      next: async (post) => {
        this.post = post;
        const html = await marked.parse(post.content ?? '');
        this.renderedContent = this.sanitizer.bypassSecurityTrustHtml(html);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
