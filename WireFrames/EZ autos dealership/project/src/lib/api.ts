import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login/', { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post('/auth/register/', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout/');
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/profiles/me/');
  return response.data;
};

// Team members endpoints
export const getTeamMembers = async () => {
  const response = await api.get('/team-members/');
  return response.data;
};

export const createTeamMember = async (data: any) => {
  const response = await api.post('/team-members/', data);
  return response.data;
};

export const updateTeamMember = async (id: string, data: any) => {
  const response = await api.put(`/team-members/${id}/`, data);
  return response.data;
};

export const deleteTeamMember = async (id: string) => {
  const response = await api.delete(`/team-members/${id}/`);
  return response.data;
};

// Knowledge base endpoints
export const getKnowledgeBase = async () => {
  const response = await api.get('/knowledge-base/');
  return response.data;
};

export const createKnowledgeBase = async (data: any) => {
  const response = await api.post('/knowledge-base/', data);
  return response.data;
};

export const updateKnowledgeBase = async (id: string, data: any) => {
  const response = await api.put(`/knowledge-base/${id}/`, data);
  return response.data;
};

export const deleteKnowledgeBase = async (id: string) => {
  const response = await api.delete(`/knowledge-base/${id}/`);
  return response.data;
};

// Test drives endpoints
export const getTestDrives = async () => {
  const response = await api.get('/test-drives/');
  return response.data;
};

export const createTestDrive = async (data: any) => {
  const response = await api.post('/test-drives/', data);
  return response.data;
};

// Feedback endpoints
export const getFeedback = async () => {
  const response = await api.get('/feedback/');
  return response.data;
};

export const createFeedback = async (data: any) => {
  const response = await api.post('/feedback/', data);
  return response.data;
};

// Chat history endpoints
export const getChatHistory = async () => {
  const response = await api.get('/chat-history/');
  return response.data;
};

export const createChatMessage = async (data: any) => {
  const response = await api.post('/chat-history/', data);
  return response.data;
};