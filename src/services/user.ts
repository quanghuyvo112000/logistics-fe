import { callApi } from "../components/shared/api";
import { CreateDriverPayload, CreateManagerPayload, CreateUserPayload, CreateUserResponse, UpdateUserRequest, UpdateUserResponse, UserInfoResponse } from "../types/user.types";
import { formatDateToYMD } from "../utils/validateForm";

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

export const createDriver = async (
  userData: CreateDriverPayload
): Promise<CreateUserResponse> => {
  try {
    // Đảm bảo birthday có định dạng yyyy-MM-dd
    const formattedData: CreateDriverPayload = {
      ...userData,
      birthday:
        typeof userData.birthday === "string"
          ? userData.birthday
          : formatDateToYMD(userData.birthday),
    };

    const response = await callApi<CreateUserResponse>(
      "POST",
      "users/driver",
      formattedData,
      true
    );

    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      throw new Error("Failed to create driver. Invalid response from server.");
    }
  } catch (error) {
    console.error("Error creating driver:", error);
    throw error;
  }
};

export const createManager = async (
  userData: CreateManagerPayload
): Promise<CreateUserResponse> => {
  try {
    // Đảm bảo birthday có định dạng yyyy-MM-dd
    const formattedData: CreateManagerPayload = {
      ...userData,
      birthday:
        typeof userData.birthday === "string"
          ? userData.birthday
          : formatDateToYMD(userData.birthday),
    };

    const response = await callApi<CreateUserResponse>(
      "POST",
      "users/manager",
      formattedData,
      true
    );

    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      throw new Error("Failed to create manager. Invalid response from server.");
    }
  } catch (error) {
    console.error("Error creating manager:", error);
    throw error;
  }
};

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


