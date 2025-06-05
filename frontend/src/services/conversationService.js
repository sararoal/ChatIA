import axios from 'axios';
import { config } from "@/config/config.js";

const axiosInstance = axios.create({
  baseURL: config.API_URI,
  withCredentials: true,  // Muy importante para enviar cookies en solicitudes CORS
});

export const getAllConversations = async () => {
  const response = await axiosInstance.get('/conversation');
  return response.data;
};

export const getConversationById = async (id) => {
  const response = await axiosInstance.get(`/conversation/${id}?fields=messages`);
  return response.data;
};

export const createConversation = async ({ title, messages = [] }) => {
  const response = await axiosInstance.post('/conversation', { title, messages });
  return response.data;
};

export const updateConversation = async (conversationId, updatedFields) => {
  const response = await axiosInstance.put(`/conversation/${conversationId}`, updatedFields);
  return response.data;
};

export const sendMessage = async (conversationId, message) => {
  const response = await axiosInstance.post(`/conversation/${conversationId}/messages`, message);
  return response.data;
};

export const getConversationTitles = async () => {
  const response = await axiosInstance.get('/conversation?fields=title');
  return response.data;
};

export const deleteConversation = async (conversationId) => {
  const response = await axiosInstance.delete(`/conversation/${conversationId}`);
  return response.data;
};

// --- Añade esta función para la IA ---
export const sendMessagesToIA = async (messages) => {
  const response = await axiosInstance.post('/conversation/ia', messages);
  return response.data;
};