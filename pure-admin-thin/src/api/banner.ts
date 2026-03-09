import request from "./request";

// 获取轮播图列表（带分页）
export const getBannersList = (params: { page: number; size: number }) => {
  return request.get("/admin/banners", { params });
};

// 添加轮播图
export const createBanners = (data: { image_name: string }) => {
  return request.post("/admin/banners", data);
};

// 删除轮播图
export const deleteBanners = (id: number) => {
  return request.delete(`/admin/banners/${id}`);
};
