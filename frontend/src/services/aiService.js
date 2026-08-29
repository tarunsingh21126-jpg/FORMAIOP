import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const extractFromText = async (formId, text) => {
  const res = await api.post('/ai/extract', { formId, text });
  return res.data; // { success, data, rejectedFields }
};
