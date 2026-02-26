import request from "./request";

// 获取轮播图列表（带分页）
export const getBannerList = (params: { page: number; size: number }) => {
  return request.get("/admin/banners", { params });
};

// 添加轮播图
export const createBanner = (data: { image_name: string }) => {
  return request.post("/admin/banners", data);
};

// 更新轮播图
export const updateBanner = (id: number, data: { image_name: string }) => {
  return request.put(`/admin/banners/${id}`, data);
};

// 删除轮播图
export const deleteBanner = (id: number) => {
  return request.delete(`/admin/banners/${id}`);
};
