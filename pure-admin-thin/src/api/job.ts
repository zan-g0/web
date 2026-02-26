import request from "./request";

// 获取招聘岗位列表
export const getJobPositions = (params?: any) => {
  return request({
    url: "admin/job",
    method: "get",
    params
  });
};

// 创建招聘岗位
export const createJobPositionApi = (data: any) => {
  return request({
    url: "admin/job",
    method: "post",
    data
  });
};

// 更新招聘岗位
export const updateJobPositionApi = (id: number, data: any) => {
  return request({
    url: `admin/job/${id}`,
    method: "put",
    data
  });
};

// 删除招聘岗位
export const deleteJobPositionApi = (id: number) => {
  return request({
    url: `admin/job/${id}`,
    method: "delete"
  });
};

// 更新排序
export const updateDisplayOrderApi = (
  orders: { id: number; display_order: number }[]
) => {
  return request({
    url: "admin/job/display-order",
    method: "post",
    data: { orders }
  });
};
