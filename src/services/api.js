import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',  // Adjust this if your backend is hosted elsewhere
});

export const getSamples = () => API.get('/RQ_Analytics');
export const getSampleById = (id) => API.get(`/samples/${id}`);
export const createSample = (sample) => API.post('/samples', sample);
export const updateSample = (id, updatedSample) => API.put(`/samples/${id}`, updatedSample);
export const deleteSample = (id) => API.delete(`/samples/${id}`);
