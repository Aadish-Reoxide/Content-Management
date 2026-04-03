import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const generateContent = async (platform, tone, topic) => {
  const res = await api.post('/content/generate', { platform, tone, topic });
  return res.data;
};

export const getFeedback = async (platform) => {
  const res = await api.get(`/feedback/${platform}`);
  return res.data;
};

export const downloadFeedback = (platform) => {
  window.open(`/api/feedback/${platform}/download`, '_blank');
};