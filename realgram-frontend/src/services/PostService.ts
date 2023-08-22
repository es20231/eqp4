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
  likePost: (postId: string) => {
    return axiosInstance.put("/post/like", {
      postId,
    });
  },
  dislikePost: (postId: string) => {
    return axiosInstance.put("/post/dislike", {
      postId,
    });
  },
  sentComment: (text: string, postId: string) => {
    return axiosInstance.put("/post/comment", {
      text,
      postId,
    });
  },
  deleteComment: (commentId: string, postId: string) => {
    return axiosInstance.delete(`/post/comment/${postId}/${commentId}`);
  },
};
