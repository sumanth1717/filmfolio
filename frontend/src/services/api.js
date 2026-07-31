import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('filmfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected network error occurred. Please try again.';
};

// Auth & User API
export const loginUser = async (credentials) => {
  const res = await API.post('/auth/login', credentials);
  return res.data;
};

export const signupUser = async (formData) => {
  const res = await API.post('/auth/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const getMe = async () => {
  const res = await API.get('/auth/me');
  return res.data;
};

export const getUserById = async (id) => {
  const res = await API.get(`/auth/users/${id}`);
  return res.data;
};

export const toggleFollowUser = async (id) => {
  const res = await API.post(`/auth/follow/${id}`);
  return res.data;
};

export const toggleBlockUser = async (id) => {
  const res = await API.post(`/auth/block/${id}`);
  return res.data;
};

export const updateProfile = async (formData) => {
  const res = await API.put('/auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const getDirectory = async (params = {}) => {
  const res = await API.get('/auth/directory', { params });
  return res.data;
};

// Feed Posts API
export const getPosts = async (params = {}) => {
  const res = await API.get('/posts', { params });
  return res.data;
};

export const getPostById = async (id) => {
  const res = await API.get(`/posts/${id}`);
  return res.data;
};

export const createPost = async (formData) => {
  const res = await API.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const updatePost = async (id, formData) => {
  const res = await API.put(`/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deletePost = async (id) => {
  const res = await API.delete(`/posts/${id}`);
  return res.data;
};

export const reportItem = async ({ id, type, reason, details }) => {
  const res = await API.post(`/posts/${id}/report`, { reason, details, type });
  return res.data;
};

// Marketplace Equipment API
export const getEquipment = async (params = {}) => {
  const res = await API.get('/equipment', { params });
  return res.data;
};

export const getEquipmentById = async (id) => {
  const res = await API.get(`/equipment/${id}`);
  return res.data;
};

export const createEquipment = async (formData) => {
  const res = await API.post('/equipment', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const updateEquipment = async (id, formData) => {
  const res = await API.put(`/equipment/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteEquipment = async (id) => {
  const res = await API.delete(`/equipment/${id}`);
  return res.data;
};

// Inbox & Replies API
export const sendReply = async (replyData) => {
  const res = await API.post('/replies', replyData);
  return res.data;
};

export const getReceivedReplies = async () => {
  const res = await API.get('/replies/received');
  return res.data;
};

export const getSentReplies = async () => {
  const res = await API.get('/replies/sent');
  return res.data;
};

export const updateReplyStatus = async (id, status) => {
  const res = await API.put(`/replies/${id}/status`, { status });
  return res.data;
};

export default API;
