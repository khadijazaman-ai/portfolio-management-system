import axiosInstance from './axiosInstance';

export const loginUser = async (credentials) => {
  const res = await axiosInstance.post('/api/auth/login', credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axiosInstance.post('/api/auth/register', userData);
  return res.data;
};

export const changePassword = async (passwords) => {
  const res = await axiosInstance.put('/api/auth/change-password', passwords);
  return res.data;
};
