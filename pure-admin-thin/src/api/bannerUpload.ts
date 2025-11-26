import { getBannerList, createBanner, updateBanner, deleteBanner } from "@/api/banner";

interface Banner {
  id: number;
  image_name: string;
}

// 获取轮播图列表
export const fetchBannerList = async () => {
  return await getBannerList();
};

// 上传轮播图到指定文件夹
export const uploadBannerImage = async (file: File, newName?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (newName) {
    formData.append('newName', newName);
  }
  
  try {
    const response = await fetch('/api/upload/banner', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '上传失败');
    }
    
    return result;
  } catch (error) {
    console.error('Banner upload error:', error);
    throw error;
  }
};

// 创建轮播图
export const createBannerRecord = async (data: { image_name: string }) => {
  return await createBanner(data);
};

// 更新轮播图
export const updateBannerRecord = async (id: number, data: { image_name: string }) => {
  return await updateBanner(id, data);
};

// 删除轮播图
export const deleteBannerRecord = async (id: number) => {
  return await deleteBanner(id);
};
