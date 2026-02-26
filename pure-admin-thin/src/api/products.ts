import request from "./request";

// 获取产品列表（分页）
export const getProductsList = (params: { page: number; size: number }) => {
  return request.get("/admin/products", { params });
};

// 获取单个产品详情
export const getProductById = (id: number) => {
  return request.get(`/admin/products/${id}`);
};

// 创建产品
export const createProduct = (data: {
  name: string;
  description?: string;
  image_name?: string;
  display_order?: number;
  is_active?: number;
}) => {
  return request.post("/admin/products", data);
};

// 更新产品
export const updateProduct = (
  id: number,
  data: {
    name?: string;
    description?: string;
    image_name?: string;
    display_order?: number;
    is_active?: number;
  }
) => {
  return request.put(`/admin/products/${id}`, data);
};

// 删除产品
export const deleteProduct = (id: number) => {
  return request.delete(`/admin/products/${id}`);
};

// 批量删除产品
export const batchDeleteProducts = (ids: number[]) => {
  return request.post("/admin/products/batch/delete", { ids });
};

// 更新产品状态
export const updateProductStatus = (id: number, is_active: number) => {
  return request.put(`/admin/products/${id}/status`, { is_active });
};
