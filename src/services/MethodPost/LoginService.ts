import { callApi } from "../../components/shared/api";
import { LoginRequest, LoginResponse } from "../../types/auth.types";

// Hàm gọi API login (POST /auth/login)
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
