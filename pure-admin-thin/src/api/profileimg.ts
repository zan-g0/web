import request from "./request";

//获取简介图列表（带分页）
export const getprofileimgList = (params: { page: number; size: number }) => {
  return request.get("admin/profileimg", { params });
};

//创建新的简介图
export const createprofileimg = (data: { image_name: string }) => {
  return request.post("admin/profileimg", data);
};

//更新简介图
export const updateprofileimg = (id: number, data: { image_name: string }) => {
  return request.put(`admin/profileimg/${id}`, data);
};

//删除简介图
export const deleteprofileimg = (id: number) => {
  return request.delete(`admin/profileimg/${id}`);
};
