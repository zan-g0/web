import request from "./request";

// 获取联系信息
export const getContactInfo = () => {
  return request.get("/contact");
};

// 更新联系信息
export const updateContactInfo = (
  id: number,
  data: {
    company_phone?: string;
    service_phone?: string;
    email?: string;
    postal_code?: string;
    address?: string;
  }
) => {
  return request.put(`/admin/contact/${id}`, data);
};
