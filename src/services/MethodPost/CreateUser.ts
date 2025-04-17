import { callApi } from "../../components/shared/api";
import { CreateUserPayload, CreateUserResponse } from "../../types/user.types";
import { formatDateToYMD } from "../../utils/validateForm";

// Hàm gọi API tạo người dùng (POST /users/customer)
export const createUser = async (
  userData: CreateUserPayload
): Promise<CreateUserResponse> => {
  try {
    // Đảm bảo birthday có định dạng yyyy-MM-dd
    const formattedData: CreateUserPayload = {
      ...userData,
      birthday:
        typeof userData.birthday === "string"
          ? userData.birthday
          : formatDateToYMD(userData.birthday),
    };

    const response = await callApi<CreateUserResponse>(
      "POST",
      "users/customer",
      formattedData,
      false // Không cần authentication
    );

    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      throw new Error("Failed to create user. Invalid response from server.");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

