import axios from "axios";
import { Question, Stats } from "../types/Question";

const API_URL = "http://localhost:8000";

export const api = {
  getQuestions: async (): Promise<Question[]> => {
    const response = await axios.get(`${API_URL}/questions`);
    return response.data;
  },

  createQuestion: async (question: Question): Promise<Question> => {
    const response = await axios.post(`${API_URL}/questions`, question);
    return response.data;
  },

  updateQuestion: async (id: string, question: Partial<Question>): Promise<Question> => {
    const response = await axios.put(`${API_URL}/questions/${id}`, question);
    return response.data;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/questions/${id}`);
  },

  getStats: async (): Promise<Stats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },
};
