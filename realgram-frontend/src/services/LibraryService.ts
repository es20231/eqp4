import axiosInstance from "./AxiosInstance";

export default {
  saveImageInLibrary: (file: File) => {
    return axiosInstance.post("/library/save-image", {
      file,
    });
  },
  deleteImageFromLibrary: (imageID: string) => {
    return axiosInstance.delete(`/library/delete-image/${imageID}`);
  },
};
