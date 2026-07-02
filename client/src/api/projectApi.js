import axiosInstance from './axiosInstance';

// Fetch all projects (with search, category, status query parameters)
export const getProjects = async (params = {}) => {
  const res = await axiosInstance.get('/api/projects', { params });
  return res.data;
};

// Fetch single project details by ID
export const getProjectById = async (id) => {
  const res = await axiosInstance.get(`/api/projects/${id}`);
  return res.data;
};

// Create a new project (using FormData)
export const createProject = async (formData) => {
  const res = await axiosInstance.post('/api/projects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Update an existing project (using FormData)
export const updateProject = async (id, formData) => {
  const res = await axiosInstance.put(`/api/projects/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Delete a project by ID
export const deleteProject = async (id) => {
  const res = await axiosInstance.delete(`/api/projects/${id}`);
  return res.data;
};

// Fetch all categories
export const getCategories = async () => {
  const res = await axiosInstance.get('/api/categories');
  return res.data;
};

// Create category
export const createCategory = async (categoryData) => {
  const res = await axiosInstance.post('/api/categories', categoryData);
  return res.data;
};

// Update category
export const updateCategory = async (id, categoryData) => {
  const res = await axiosInstance.put(`/api/categories/${id}`, categoryData);
  return res.data;
};

// Delete category
export const deleteCategory = async (id) => {
  const res = await axiosInstance.delete(`/api/categories/${id}`);
  return res.data;
};
