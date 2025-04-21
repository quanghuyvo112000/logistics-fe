import { callApi } from "../components/shared/api";
import { CreateWarehousePayload, CreateWarehouseResponse, WarehouseListResponse, WarehouseResponse } from "../types/warehouse.types";
import { formatDateToYMD } from "../utils/validateForm";

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

export const getAllWarehouse = async (): Promise<WarehouseListResponse> => {
  try {
    const response = await callApi<WarehouseListResponse>(
      "GET",
      "warehouse-locations",
      undefined,
      true
    );

    if ((response.status === 200 || response.status === 0) && Array.isArray(response.data)) {
      return response;
    } else {
      throw new Error("Failed to fetch warehouse list. Invalid response format.");
    }
  } catch (error) {
    console.error("Failed to fetch warehouse list:", error);
    throw error;
  }
};

export const getWarehouse = async (): Promise<WarehouseResponse> => {
  try {
    const response = await callApi<WarehouseResponse>(
      "GET",
      "warehouse-locations/manager",
      undefined,
      true
    );

    if ((response.status === 200 || response.status === 0) && response.data) {
      return response;
    } else {
      throw new Error("Failed to fetch warehouse. Invalid response format.");
    }
  } catch (error) {
    console.error("Failed to fetch warehouse:", error);
    throw error;
  }
};