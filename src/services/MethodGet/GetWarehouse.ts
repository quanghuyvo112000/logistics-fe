import { callApi } from "../../components/shared/api";
import { WarehouseResponse } from "../../types/warehouse.types";

export const getWarehouse = async (): Promise<WarehouseResponse> => {
  try {
    const response = await callApi<WarehouseResponse>(
      "GET",
      "warehouse-location/manager",
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
