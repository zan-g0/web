import request from "./request";

// 获取新闻列表（分页）
export const getNewsList = (params: {
  page: number;
  size: number;
  category?: string;
  status?: string;
}) => {
  return request.get("/admin/news", { params });
};

// 获取单条新闻详情
export const getNewsById = (id: number) => {
  return request.get(`/admin/news/${id}`);
};

// 创建新闻
export const createNews = (data: {
  title: string;
  summary?: string;
  content?: string;
  cover_image?: string;
  category?: string;
  author?: string;
  status?: "draft" | "published";
  publish_date?: string;
}) => {
  return request.post("/admin/news", data);
};

// 更新新闻
export const updateNews = (
  id: number,
  data: {
    title?: string;
    summary?: string;
    content?: string;
    cover_image?: string;
    category?: string;
    author?: string;
    status?: "draft" | "published";
    publish_date?: string;
  }
) => {
  return request.put(`/admin/news/${id}`, data);
};

// 删除新闻
export const deleteNews = (id: number) => {
  return request.delete(`/admin/news/${id}`);
};

// 批量删除新闻
export const batchDeleteNews = (ids: number[]) => {
  return request.post("/admin/news/batch/delete", { ids });
};

// 更新新闻状态
export const updateNewsStatus = (id: number, status: "draft" | "published") => {
  return request.put(`/admin/news/${id}/status`, { status });
};

// 按分类获取新闻
export const getNewsByCategory = (
  category: string,
  params: { page: number; size: number }
) => {
  return request.get(`/admin/news/category/${category}`, { params });
};

// 搜索新闻
export const searchNews = (
  keyword: string,
  params: { page: number; size: number }
) => {
  return request.get("/admin/news/search", { params: { keyword, ...params } });
};
