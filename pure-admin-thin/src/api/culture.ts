import request from "./request";

export default {
  // 获取文化列表（分页可选）
  getCultures(params?: Record<string, any>) {
    return request.get("/admin/culture", { params });
  },

  // 获取单条文化详情
  getCultureById(id: string | number) {
    return request.get(`/admin/culture/${id}`);
  },

  // 创建文化
  createCulture(data: Record<string, any>) {
    return request.post("/admin/culture", data);
  },

  // 更新文化
  updateCulture(id: string | number, data: Record<string, any>) {
    return request.put(`/admin/culture/${id}`, data);
  },

  // 删除文化
  deleteCulture(id: string | number) {
    return request.delete(`/admin/culture/${id}`);
  }
};
