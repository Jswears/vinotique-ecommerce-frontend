import axios, { AxiosInstance } from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const axiosClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  get: async (url: string, params = {}) => {
    try {
      const response = await axiosClient.get(url, { params });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null; // Return null if the resource is not found
      }
      console.error(
        "Error GET:",
        error.response ? error.response.data : error.message
      );
      throw error.response ? error.response.data : error;
    }
  },
  post: async (url: string, data = {}) => {
    try {
      const response = await axiosClient.post(url, data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error POST:",
        error.response ? error.response.data : error.message
      );
      throw error.response ? error.response.data : error;
    }
  },
  put: async (url: string, data = {}) => {
    try {
      const response = await axiosClient.put(url, data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error PUT:",
        error.response ? error.response.data : error.message
      );
      throw error.response ? error.response.data : error;
    }
  },
  delete: async (url: string) => {
    try {
      const response = await axiosClient.delete(url);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error DELETE:",
        error.response ? error.response.data : error.message
      );
      throw error.response ? error.response.data : error;
    }
  },
};
