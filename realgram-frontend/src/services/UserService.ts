import axiosInstance from "./AxiosInstance";

export default {
  getAllUser: () => {
    return axiosInstance.get("/user/get-all");
  },
  getUserByUsername: (username: string) => {
    return axiosInstance.get(`/user/get-by-username/${username}`);
  },
};
