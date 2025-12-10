import request from "./request";

export const getContactInfoList = (params: { page: number; size: number }) => {
  return request.get("/api/contact/admin", { params });
};

export const createContactInfo = (data: {
  company_phone?: string;
  service_phone?: string;
  fax?: string;
  email?: string;
  postal_code?: string;
  address?: string;
  is_active?: number
}) => {
  return request.post("/api/contact/admin", data);
};

export const updateContactInfo = (id: number, data: {
  company_phone?: string;
  service_phone?: string;
  fax?: string;
  email?: string;
  postal_code?: string;
  address?: string;
  is_active?: number
}) => {
  return request.put(`/api/contact/admin/${id}`, data);
};

export const deleteContactInfo = (id: number) => {
  return request.delete(`/api/contact/admin/${id}`);
};