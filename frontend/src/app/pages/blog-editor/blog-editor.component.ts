import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './blog-editor.component.html',
  styles: [`
    .editor-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }
    @media (max-width: 768px) {
      .editor-layout { grid-template-columns: 1fr; }
    }

    .editor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .editor-pane h3 {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }

    .content-area {
      width: 100%;
      min-height: 400px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      line-height: 1.7;
      resize: vertical;
    }

    .preview-pane {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 1.5rem;
      min-height: 400px;
      overflow-y: auto;
    }

    .meta-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    @media (max-width: 600px) { .meta-row { grid-template-columns: 1fr; } }

    .publish-toggle {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      cursor: pointer;
      margin-bottom: 1.5rem;

      input[type="checkbox"] { width: 1rem; height: 1rem; accent-color: var(--accent); cursor: pointer; }
      span { font-weight: 500; font-size: 0.95rem; }
      small { color: var(--text-muted); font-size: 0.8rem; display: block; }
    }

    .form-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  `],
})
export class BlogEditorComponent implements OnInit {
  title = '';
  slug = '';
  summary = '';
  content = '';
  published = false;
  preview: SafeHtml = '';

  editPost?: BlogPost;
  saving = false;
  successMsg = '';
  errorMsg = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);
  private sanitizer = inject(DomSanitizer);

  get isEdit(): boolean {
    return !!this.editPost;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Editing — load via list and find by id (or just fetch by id if we had that route)
      this.blogService.getPosts(false).subscribe((posts) => {
        const found = posts.find((p) => p.id === Number(id));
        if (found) {
          this.editPost = found;
          this.title = found.title;
          this.slug = found.slug;
          this.summary = found.summary;
          this.published = found.published;
          // Fetch full content
          this.blogService.getPost(found.slug).subscribe((full) => {
            this.content = full.content ?? '';
            this.updatePreview();
          });
        }
      });
    }
  }

  async updatePreview() {
    const html = await marked.parse(this.content);
    this.preview = this.sanitizer.bypassSecurityTrustHtml(html);
  }

  autoSlug() {
    if (!this.isEdit) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }

  save() {
    if (!this.title.trim() || !this.content.trim()) {
      this.errorMsg = 'Title and content are required.';
      return;
    }
    this.saving = true;
    this.errorMsg = '';
    this.successMsg = '';

    const payload = {
      title: this.title,
      slug: this.slug,
      summary: this.summary,
      content: this.content,
      published: this.published,
    };

    const req = this.isEdit
      ? this.blogService.updatePost(this.editPost!.id, payload)
      : this.blogService.createPost(payload);

    req.subscribe({
      next: (post) => {
        this.saving = false;
        this.successMsg = `Post "${post.title}" saved successfully!`;
        if (!this.isEdit) {
          this.router.navigate(['/blog', post.slug]);
        }
      },
      error: () => {
        this.saving = false;
        this.errorMsg = 'Failed to save the post. Please try again.';
      },
    });
  }
}
