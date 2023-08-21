import axiosInstance from "./AxiosInstance";

export default {
  saveImageInLibrary: (file: File, body: string) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", "genericTitle");
    formData.append("body", body);

    return axiosInstance.post("/post/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
