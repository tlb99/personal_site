export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePostPayload {
  title: string;
  summary: string;
  content: string;
  published: boolean;
  slug?: string;
}
