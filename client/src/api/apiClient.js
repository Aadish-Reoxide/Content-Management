import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const generateContent = async (platform, tone) => {
  const res = await api.post('/content/generate', { platform, tone });
  return res.data;
};

export const getFeedback = async (platform) => {
  const res = await api.get(`/feedback/${platform}`);
  return res.data;
};

export const downloadFeedback = (platform) => {
  window.open(`/api/feedback/${platform}/download`, '_blank');
};