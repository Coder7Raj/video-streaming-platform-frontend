import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const signup = (data) => axios.post(`${API_URL}/auth/signup`, data);
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);

export const uploadVideo = async (formData, token) => {
  return await fetch("http://localhost:5000/api/videos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((res) => res.json());
};

export const getVideos = () => axios.get(`${API_URL}/videos`);

export const updateVideo = (id, data) => {
  return axios.put(`${API_URL}/videos/${id}`, data);
};

export const deleteVideo = (id) =>
  axios.delete(`${API_URL}/videos/${id}`, { headers: getAuthHeader() });

export const searchVideos = (query) =>
  axios.get(`${API_URL}/videos/search?query=${query}`);
//
export const getComments = (videoId) =>
  axios.get(`${API_URL}/comments/${videoId}`);
export const addComment = (commentData) =>
  axios.post(`${API_URL}/comments`, commentData);
export const updateComment = (id, data) =>
  axios.put(`${API_URL}/comments/${id}`, data);
export const deleteComment = (id, user) =>
  axios.delete(`${API_URL}/comments/${id}`, { data: { user } });
