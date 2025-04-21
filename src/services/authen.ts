import { callApi } from "../components/shared/api";
import { localStorageHelper } from "../components/shared/localStorageHelper";
import { IntrospectRequest, IntrospectResponse, LoginRequest, LoginResponse, LogoutRequest, LogoutResponse, RefreshTokenApiResponse } from "../types/auth.types";

export const introspectToken = async (token: string): Promise<IntrospectResponse> => {
  const payload: IntrospectRequest = { token };

  try {
    const response = await callApi<IntrospectResponse, IntrospectRequest>(
      'POST',
      'auth/introspect',
      payload,
      false 
    );

    return response;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    // Nếu callApi quăng lỗi (như 401), xử lý trả ra giống như API định nghĩa
    return {
      status: 401,
      message: 'Invalid or expired token',
      data: false,
    };
  }
};

export const refreshToken = async (token: string): Promise<string> => {
  const response = await callApi<RefreshTokenApiResponse, { token: string }>(
    'POST',
    'auth/refresh-token',
    { token },
    false
  );

  // Trả về token mới
  return response.data;
};

export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
): Promise<LoginResponse> => {
  try {
    // Gọi API mà không cần xác thực (no authentication)
    const response = await callApi<LoginResponse, LoginRequest>(
      "POST",
      "auth/login",
      { email, password },
      false // không cần authen (token)
    );

    // Kiểm tra xem status có phải là 200 không
    if (response.status === 200 && response.data) {
      // Lưu token vào localStorage dưới dạng mảng
      const tokenData = {
        token: response.data, // Lưu token
        rememberMe, // Lưu trạng thái rememberMe
      };
      localStorage.setItem("auth_token", JSON.stringify([tokenData])); // Lưu dưới dạng mảng

      return response;
    } else {
      throw new Error("Login failed. Invalid response from server.");
    }
  } catch (error) {
    console.error("Login failed:", error); // In ra lỗi nếu có
    throw error; // Ném lỗi cho phần gọi hàm xử lý tiếp
  }
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    // Lấy token từ localStorage
    const authDataString = localStorageHelper.getItem<string>('auth_token');
    
    if (authDataString) {
      // Parse chuỗi JSON thành đối tượng
      const authData = JSON.parse(authDataString);

      if (authData && authData.token) {
        const token = authData.token;

        // Gọi API logout với token
        const response = await callApi<LogoutResponse, LogoutRequest>(
          "POST",  // HTTP method
          "auth/logout",  // API endpoint
          { token },  // Gửi token lên server
          false  // Không cần xác thực (token đã gửi trong request)
        );

        // Nếu thành công, xóa token khỏi localStorage
        localStorageHelper.removeItem('auth_token');
        
        return response;
        
      } else {
        throw new Error("Token is missing.");
      }
    } else {
      throw new Error("No token found in localStorage.");
    }
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};