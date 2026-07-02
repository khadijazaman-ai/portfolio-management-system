import axiosInstance from './axiosInstance';

// Fetch dashboard statistics
export const getStats = async () => {
  const res = await axiosInstance.get('/api/dashboard/stats');
  return res.data;
};

// Fetch recent activity logs
export const getRecentActivities = async () => {
  const res = await axiosInstance.get('/api/dashboard/recent-activity');
  return res.data;
};

// Fetch notifications feed
export const getNotifications = async () => {
  const res = await axiosInstance.get('/api/dashboard/notifications');
  return res.data;
};

// Mark all notifications as read
export const markNotificationsRead = async () => {
  const res = await axiosInstance.put('/api/dashboard/notifications/mark-read');
  return res.data;
};

// Mark single notification as read
export const markSingleNotificationRead = async (id) => {
  const res = await axiosInstance.put(`/api/dashboard/notifications/${id}/read`);
  return res.data;
};
