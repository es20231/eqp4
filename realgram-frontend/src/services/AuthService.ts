import axiosInstance from "./AxiosInstance";

export default {
  register: (
    name: string,
    email: string,
    username: string,
    password: string
  ) => {
    return axiosInstance.post("/auth/register", {
      name,
      email,
      username,
      password,
    });
  },
  login: (email: string, password: string) => {
    return axiosInstance.post("/auth/login", {
      email,
      password,
    });
  },
  logout: () => {
    return axiosInstance.post("/auth/logout");
  },
  sendRecoverPasswordCode: (email: string) => {
    return axiosInstance.post("/auth/forgot_password", {
      email,
    });
  },
  recoverPassword: (token: string, newPassword: string) => {
    return axiosInstance.post("/auth/change_pass", {
      token,
      newPassword,
    });
  },
};
