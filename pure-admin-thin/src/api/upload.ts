import request from "./request";

export function uploadFile(file: File, type: string) {
  const formData = new FormData();
  formData.append("image", file);

  return request({
    url: `/admin/upload/${type}`,
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
