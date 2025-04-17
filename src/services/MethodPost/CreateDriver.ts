import { callApi } from "../../components/shared/api";
import { CreateDriverPayload, CreateUserResponse } from "../../types/user.types";
import { formatDateToYMD } from "../../utils/validateForm";

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
