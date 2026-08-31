import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getForm = async (formId) => {
  const res = await api.get(`/forms/${formId}`);
  return res.data.data;
};

export const createForm = async (formData) => {
  const res = await api.post('/forms', formData);
  return res.data.data;
};

export const updateForm = async (formId, formData) => {
  const res = await api.put(`/forms/${formId}`, formData);
  return res.data.data;
};

export const deleteForm = async (formId) => {
  const res = await api.delete(`/forms/${formId}`);
  return res.data;
};
