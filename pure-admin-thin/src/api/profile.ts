import request from "./request";

export const getprofile = (params: { page: number; size: number }) => {
  return request.get("admin/profile", { params });
};

export const createprofile = (data: {
  txt: string;
  order?: number;
  is_active?: number;
}) => {
  return request.post("admin/profile/", data);
};

export const updateprofile = (
  id: number,
  data: { txt?: string; order?: number; is_active?: number }
) => {
  return request.put(`admin/profile/${id}`, data);
};

export const deleteprofile = (id: number) => {
  return request.delete(`admin/profile/${id}`);
};
