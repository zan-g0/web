export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  cover_image?: string | null;
  category?: string | null;
  publish_date?: string | null;
  views?: number;
  content?: string;
  author?: string;
}

export interface NewsResponse {
  code: number;
  data: {
    items: NewsItem[];
    total: number;
  };
}

export interface NewsDetailResponse {
  code: number;
  data: NewsItem;
}