import { callApi } from "../../components/shared/api";
import { WarehouseListResponse } from "../../types/warehouse.types";


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
