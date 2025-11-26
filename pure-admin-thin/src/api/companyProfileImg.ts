import request from "@/api/request";

export const getCompanyProfileImgList = (params: { page: number; size: number }) => {
  return request.get("/api/companyProfileImg/admin", { params });
};

export const createCompanyProfileImg = (data: { img_name: string; order?: number; is_active?: number }) => {
  return request.post("/api/companyProfileImg/admin", data);
};

export const updateCompanyProfileImg = (id: number, data: { img_name?: string; order?: number; is_active?: number }) => {
  return request.put(`/api/companyProfileImg/admin/${id}`, data);
};

export const deleteCompanyProfileImg = (id: number) => {
  return request.delete(`/api/companyProfileImg/admin/${id}`);
};

// 上传图片（封装到单独接口，需后端 /api/upload 支持）
export const uploadImage = (formData: FormData) => {
  return request.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};