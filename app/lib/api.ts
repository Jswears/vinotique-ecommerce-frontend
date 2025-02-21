import axios, { AxiosInstance, AxiosResponse } from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const axiosClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  get: async <T>(url: string, params = {}): Promise<T | null> => {
    try {
      const response: AxiosResponse<T> = await axiosClient.get(url, { params });
      return response.data;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 404
      ) {
        return null; // Return null if the resource is not found
      }
      console.error(
        "Error GET:",
        axios.isAxiosError(error) && error.response
          ? error.response.data
          : error
      );
      throw axios.isAxiosError(error) && error.response
        ? error.response.data
        : error;
    }
  },
  post: async <T>(url: string, data = {}): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosClient.post(url, data);
      return response.data;
    } catch (error) {
      console.error(
        "Error POST:",
        axios.isAxiosError(error) && error.response
          ? error.response.data
          : error
      );
      throw axios.isAxiosError(error) && error.response
        ? error.response.data
        : error;
    }
  },
  put: async <T>(url: string, data = {}): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosClient.put(url, data);
      return response.data;
    } catch (error) {
      console.error(
        "Error PUT:",
        axios.isAxiosError(error) && error.response
          ? error.response.data
          : error
      );
      throw axios.isAxiosError(error) && error.response
        ? error.response.data
        : error;
    }
  },
  delete: async <T>(url: string): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosClient.delete(url);
      return response.data;
    } catch (error) {
      console.error(
        "Error DELETE:",
        axios.isAxiosError(error) && error.response
          ? error.response.data
          : error
      );
      throw axios.isAxiosError(error) && error.response
        ? error.response.data
        : error;
    }
  },
};
