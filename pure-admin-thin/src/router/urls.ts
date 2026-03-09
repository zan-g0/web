export const getUploadUrl = (path: string): string => {
  if (!path) return "";
  // 已经是完整 URL
  if (/^https?:\/\//i.test(path)) return path;

  // 提供默认 base，以防 import.meta.env.VITE_API_BASE 未定义
  const rawBase =
    (import.meta.env.VITE_API_BASE_URL as string) || "http://10.182.251.1:3000/api";
  const publicBase = rawBase.replace(/\/api(\/|$)/, "").replace(/\/$/, "");

  const cleanPath = path.replace(/^\/+/, "");
  return `${publicBase}/uploads/${cleanPath}`;
};
