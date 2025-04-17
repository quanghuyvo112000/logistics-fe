import { callApi } from "../../components/shared/api";
import { UpdateUserRequest, UpdateUserResponse } from "../../types/user.types";

// Hàm gọi API cập nhật thông tin người dùng (PUT /users)
export const updateUserProfile = async (
  payload: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  try {
    const response = await callApi<UpdateUserResponse>(
      "PUT",
      "users",
      payload,
      true // Cần xác thực bằng token
    );

    if (response.status === 200 && response.data) {
      return response;
    } else {
      throw new Error("Failed to update user information. Invalid response.");
    }
  } catch (error) {
    console.error("Failed to update user information:", error);
    throw error;
  }
};
