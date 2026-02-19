import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog-list/blog-list.component').then(
        (m) => m.BlogListComponent
      ),
  },
  {
    path: 'blog/new',
    loadComponent: () =>
      import('./pages/blog-editor/blog-editor.component').then(
        (m) => m.BlogEditorComponent
      ),
  },
  {
    path: 'blog/edit/:id',
    loadComponent: () =>
      import('./pages/blog-editor/blog-editor.component').then(
        (m) => m.BlogEditorComponent
      ),
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./pages/blog-post/blog-post.component').then(
        (m) => m.BlogPostComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
