import { callApi } from "../../components/shared/api";
import { CreateManagerPayload, CreateUserResponse } from "../../types/user.types";
import { formatDateToYMD } from "../../utils/validateForm";

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
