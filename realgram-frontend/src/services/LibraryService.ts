import axiosInstance from "./AxiosInstance";

export default {
  saveImageInLibrary: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return axiosInstance.post("/library/save-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteImageFromLibrary: (imageID: string) => {
    return axiosInstance.delete(`/library/delete-image/${imageID}`);
  },
};
