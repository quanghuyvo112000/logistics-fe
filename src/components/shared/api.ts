import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, Method } from 'axios';
import { localStorageHelper } from './localStorageHelper';

const API_BASE_URL = 'https://a058-2401-d800-a8f-3fe7-41fb-c8df-e8d3-c1bb.ngrok-free.app/api/';

export const callApi = async <TResponse = unknown, TData = unknown>(
  method: Method,
  url: string,
  data?: TData,
  needAuth: boolean = false,
  config?: AxiosRequestConfig,
): Promise<TResponse> => {
  // Cấu hình header mặc định
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Nếu cần Auth, thêm Authorization header
  if (needAuth) {
    try {
      // Lấy auth_token từ localStorage
      const authDataString = localStorageHelper.getItem<string>('auth_token');

      if (authDataString) {
        // Parse chuỗi JSON thành đối tượng
        const authData = JSON.parse(authDataString);

        if (authData && authData.token) {
          // Lấy token từ đối tượng authData
          const token = authData.token;

          // Thêm token vào header Authorization
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          throw new Error('Token is missing in auth_token.');
        }
      } else {
        throw new Error('auth_token is missing from localStorage.');
      }
    } catch (error) {
      console.error('Error while retrieving auth_token:', error);
      throw new Error('Failed to retrieve authentication token from localStorage.');
    }
  }

  try {
    // Gọi API với axios
    const response: AxiosResponse<TResponse> = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers,
      withCredentials: true,
      ...config,  // Merge các cấu hình bổ sung từ tham số config
    });

    return response.data; // Trả về dữ liệu từ response
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error(`API ${method} ${url} failed`, axiosError);

    // Nếu có lỗi trả về từ API (có response.data)
    if (axiosError.response?.data) {
      // Trả về dữ liệu lỗi từ API
      throw axiosError.response.data;
    }

    // Nếu không có response (chắc là lỗi mạng, timeout...)
    throw new Error(axiosError.message);
  }
};
