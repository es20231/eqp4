import axiosInstance from "./AxiosInstance";

export default {
  getUserByUsername: (username: string) => {
    return axiosInstance.get(`/user/get-by-username/${username}`);
  },
};
