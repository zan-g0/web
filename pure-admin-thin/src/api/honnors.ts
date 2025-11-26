import request from "@/api/request";

export const getHonnorsList = (params: { page: number; size: number }) => {
  return request.get("/api/companyHonnors/admin", { params });
};

export const createHonnorApi = (data: { title: string; description?: string; image?: string; order?: number; is_active?: number }) => {
  return request.post("/api/companyHonnors/admin", data);
};

export const updateHonnorApi = (id: number, data: { title?: string; description?: string; image?: string; order?: number; is_active?: number }) => {
  return request.put(`/api/companyHonnors/admin/${id}`, data);
};

export const deleteHonnorApi = (id: number) => {
  return request.delete(`/api/companyHonnors/admin/${id}`);
};

export const uploadHonnorImage = (formData: FormData) => {
  return request.post("/api/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
};