import axiosInstance from "./AxiosInstance";

export default {
  login: (email: string, password: string) => {
    return axiosInstance.post("/login", {
      email,
      password,
    });
  },
  register: (
    name: string,
    email: string,
    username: string,
    password: string
  ) => {
    return axiosInstance.post("/signup", {
      name,
      email,
      username,
      password,
    });
  },
};
