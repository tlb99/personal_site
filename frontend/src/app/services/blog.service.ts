import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost, CreatePostPayload } from '../models/blog.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly api = '/api/blog';

  constructor(private http: HttpClient) {}

  getPosts(publishedOnly = true): Observable<BlogPost[]> {
    const params = new HttpParams().set('published', String(publishedOnly));
    return this.http.get<BlogPost[]>(`${this.api}/`, { params });
  }

  getPost(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.api}/${slug}`);
  }

  createPost(payload: CreatePostPayload): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.api}/`, payload);
  }

  updatePost(id: number, payload: Partial<CreatePostPayload>): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.api}/${id}`, payload);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
