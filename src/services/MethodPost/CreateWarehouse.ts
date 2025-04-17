import { callApi } from "../../components/shared/api";
import { CreateWarehousePayload, CreateWarehouseResponse } from "../../types/warehouse.types";
import { formatDateToYMD } from "../../utils/validateForm";

export const createWarehouse = async (
  userData: CreateWarehousePayload
): Promise<CreateWarehouseResponse> => {
  try {
    // Đảm bảo birthday có định dạng yyyy-MM-dd
    const formattedData: CreateWarehousePayload = {
      ...userData,
      birthday:
        typeof userData.birthday === "string"
          ? userData.birthday
          : formatDateToYMD(userData.birthday),
    };

    const response = await callApi<CreateWarehouseResponse>(
      "POST",
      "users/warehouse-manager",
      formattedData,
      true
    );

    if (response.status === 201 || response.status === 200) {
      return response;
    } else {
      throw new Error("Failed to create warehouse manager. Invalid response from server.");
    }
  } catch (error) {
    console.error("Error creating warehouse manager:", error);
    throw error;
  }
};
