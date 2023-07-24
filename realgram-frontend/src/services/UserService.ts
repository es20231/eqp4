import axiosInstance from "./AxiosInstance";

export default {
  getAllUser: () => {
    return axiosInstance.get("/user/get-all");
  },
  getUserByUsername: (username: string) => {
    return axiosInstance.get(`/user/get-by-username/${username}`);
  },
  followUser: (userID: string) => {
    return axiosInstance.put("/user/follow/", {
      followId: userID,
    });
  },
  unfollowUser: (userID: string) => {
    return axiosInstance.put("/user/unfollow/", {
      unfollowId: userID,
    });
  },
};
