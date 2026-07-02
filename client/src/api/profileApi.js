import axiosInstance from './axiosInstance';

// Fetch current user's profile info (Authenticated)
export const getProfile = async () => {
  const res = await axiosInstance.get('/api/profile');
  return res.data;
};

// Update profile details (general PUT /api/profile)
export const updateProfile = async (profileData) => {
  const res = await axiosInstance.put('/api/profile', profileData);
  return res.data;
};

// Update biography & about details (PUT /api/profile/about)
export const updateProfileAbout = async (aboutData) => {
  const res = await axiosInstance.put('/api/profile/about', aboutData);
  return res.data;
};

// Update contact details (PUT /api/profile/contact)
export const updateProfileContact = async (contactData) => {
  const res = await axiosInstance.put('/api/profile/contact', contactData);
  return res.data;
};

// Update social details (PUT /api/profile/social)
export const updateProfileSocial = async (socialData) => {
  const res = await axiosInstance.put('/api/profile/social', socialData);
  return res.data;
};

// Upload profile image (using FormData)
export const uploadProfileImage = async (formData) => {
  const res = await axiosInstance.post('/api/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Seed default profile database assets
export const seedProfileData = async () => {
  const res = await axiosInstance.post('/api/profile/seed');
  return res.data;
};
