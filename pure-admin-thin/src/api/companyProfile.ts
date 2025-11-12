import request from "./request";

export const getCompanyProfileList = (params: { page: number; size: number }) => {
  return request.get("/api/companyProfile/admin", { params });
};

export const createCompanyProfile = (data: { txt: string; order?: number; is_active?: number }) => {
  return request.post("/api/companyProfile/admin", data);
};

export const updateCompanyProfile = (id: number, data: { txt?: string; order?: number; is_active?: number }) => {
  return request.put(`/api/companyProfile/admin/${id}`, data);
};

export const deleteCompanyProfile = (id: number) => {
  return request.delete(`/api/companyProfile/admin/${id}`);
};