import axios from "axios";
import { Question, Stats } from "../types/Question";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (!error.response) throw new Error('Network error - cannot connect to server');
    if (error.response.status === 404) throw new Error('Resource not found');
    if (error.response.status === 500) throw new Error('Server error');
    throw new Error(error.response.data?.detail || 'Request failed');
  }
  throw error;
};

export const api = {
  getQuestions: async (): Promise<Question[]> => {
    try {
      const response = await axios.get(`${API_URL}/questions`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  createQuestion: async (question: Question): Promise<Question> => {
    try {
      const response = await axios.post(`${API_URL}/questions`, question);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateQuestion: async (id: string, question: Partial<Question>): Promise<Question> => {
    try {
      const response = await axios.put(`${API_URL}/questions/${id}`, question);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  deleteQuestion: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/questions/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  getStats: async (): Promise<Stats> => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};
