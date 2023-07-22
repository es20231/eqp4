export default {
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data != null ? JSON.parse(data) : null;
  },
  set: (key: string, data: any) => {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
  },
};
