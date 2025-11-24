import axios from "axios";

const API_URL = "http://localhost:5000/api"; // change to your backend URL

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const signup = (data) => axios.post(`${API_URL}/auth/signup`, data);
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);

export const uploadVideo = (data) =>
  axios.post(`${API_URL}/videos`, data, { headers: getAuthHeader() });
export const getVideos = () => axios.get(`${API_URL}/videos`);
export const deleteVideo = (id) =>
  axios.delete(`${API_URL}/videos/${id}`, { headers: getAuthHeader() });

export const searchVideos = (query) =>
  axios.get(`${API_URL}/videos/search?query=${query}`);
