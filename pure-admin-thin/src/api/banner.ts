import request from "./request"; // 或 '@/utils/http/request'，根据你的项目结构调整

// 获取轮播图列表（带分页）
export const getBannerList = (params: { page: number; size: number }) => {
  return request.get("/api/banners", { params });
};

// 添加轮播图
export const createBanner = (data: { image_name: string }) => {
  return request.post("/api/banners", data);
};

// 更新轮播图
export const updateBanner = (id: number, data: { image_name: string }) => {
  return request.put(`/api/banners/${id}`, data);
};

// 删除轮播图
export const deleteBanner = (id: number) => {
  return request.delete(`/api/banners/${id}`);
};
