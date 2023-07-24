import axiosInstance from "./AxiosInstance";

export default {
  getAllUser: () => {
    return axiosInstance.get("/user/get-all");
  },
  getUserByUsername: (username: string) => {
    return axiosInstance.get(`/user/get-by-username/${username}`);
  },
  editUserProfile: (
    userID: string,
    name: string,
    description: string,
    profilePhoto: File | string
  ) => {
    console.log("Edit User Profile");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("profilePhoto", profilePhoto);
    if (profilePhoto == "") formData.append("removeProfilePhoto", String(true));
    console.log(formData);

    return axiosInstance.put(
      `/user/edit-current-user-profile/${userID}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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
