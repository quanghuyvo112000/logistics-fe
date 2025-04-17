import { callApi } from "../../components/shared/api";
import { UserInfoResponse } from "../../types/user.types";


// Hàm gọi API lấy thông tin người dùng (GET /user/info)
export const getProfile = async (): Promise<UserInfoResponse> => {
  try {
    // Gọi API với xác thực (authentication) bằng token
    const response = await callApi<UserInfoResponse>(
      "GET",
      "users/profile",
      undefined, // Không gửi dữ liệu body cho phương thức GET
      true // Cần xác thực (token)
    );

    // Kiểm tra xem status có phải là 200 không
    if (response.status === 200 && response.data) {
      // Trả về dữ liệu thông tin người dùng từ response
      return response;
    } else {
      throw new Error(
        "Failed to fetch user information. Invalid response from server."
      );
    }
  } catch (error) {
    console.error("Failed to fetch user information:", error); // In ra lỗi nếu có
    throw error; // Ném lỗi cho phần gọi hàm xử lý tiếp
  }
};
