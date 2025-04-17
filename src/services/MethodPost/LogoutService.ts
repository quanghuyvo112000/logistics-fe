import { callApi } from "../../components/shared/api";
import { localStorageHelper } from "../../components/shared/localStorageHelper";
import { LogoutRequest, LogoutResponse } from "../../types/auth.types";

// Hàm gọi API logout (POST /auth/logout)
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
