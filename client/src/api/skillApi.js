import axiosInstance from './axiosInstance';

export const getSkills = async () => {
  const res = await axiosInstance.get('/api/skills');
  return res.data;
};

export const createSkill = async (skillData) => {
  const res = await axiosInstance.post('/api/skills', skillData);
  return res.data;
};

export const updateSkill = async (id, skillData) => {
  const res = await axiosInstance.put(`/api/skills/${id}`, skillData);
  return res.data;
};

export const deleteSkill = async (id) => {
  const res = await axiosInstance.delete(`/api/skills/${id}`);
  return res.data;
};
