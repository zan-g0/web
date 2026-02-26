import request from "./request";

export const getHonorsList = (params: { page: number; size: number }) => {
  return request.get("admin/Honor", { params });
};

export const createHonor = (data: {
  title: string;
  description?: string;
  image?: string;
  order?: number;
  is_active?: number;
}) => {
  return request.post("admin/Honor", data);
};

export const updateHonor = (
  id: number,
  data: {
    title?: string;
    description?: string;
    image?: string;
    order?: number;
    is_active?: number;
  }
) => {
  return request.put(`admin/Honor/${id}`, data);
};

export const deleteHonor = (id: number) => {
  return request.delete(`admin/Honor/${id}`);
};
