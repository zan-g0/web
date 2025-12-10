import request from '@/api/request';

// 获取招聘岗位列表
export const getJobPositions = () => {
  return request.get('/api/jobs/positions');
};

// 创建招聘岗位
export const createJobPositionApi = (data: any) => {
  return request.post('/api/jobs/positions', data);
};

// 更新招聘岗位
export const updateJobPositionApi = (id: number, data: any) => {
  return request.put(`/api/jobs/positions/${id}`, data);
};

// 删除招聘岗位
export const deleteJobPositionApi = (id: number) => {
  return request.delete(`/api/jobs/positions/${id}`);
};