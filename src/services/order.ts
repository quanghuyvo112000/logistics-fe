import { callApi } from "../components/shared/api";
import { localStorageHelper } from "../components/shared/localStorageHelper";
import { AssignShipperRequest, AssignWarehouseRequest, CreateOrderRequest, OrderConfirmDeliveryRequest, OrderConfirmPickupRequest, OrderResponse } from "../types/order.type";
import {
  SearchWarehouseLocationsRequest,
  SearchWarehouseLocationsResponse,
} from "../types/warehouse.types";

export const createOrder = async (request: CreateOrderRequest) => {
  const formData = new FormData();

  // Duyệt qua các field dạng string/number
  formData.append("sourceWarehouseId", request.sourceWarehouseId);
  formData.append("destinationWarehouseId", request.destinationWarehouseId);
  formData.append("senderName", request.senderName);
  formData.append("senderPhone", request.senderPhone);
  formData.append("senderAddress", request.senderAddress);
  formData.append("receiverName", request.receiverName);
  formData.append("receiverPhone", request.receiverPhone);
  formData.append("receiverAddress", request.receiverAddress);
  formData.append("weight", request.weight.toString());
  formData.append("orderPrice", request.orderPrice.toString());
  formData.append("shippingFee", request.shippingFee.toString());
  formData.append("expectedDeliveryTime", request.expectedDeliveryTime);

  const authDataString = localStorageHelper.getItem<string>("auth_token");
  let token: string = "";
  if (authDataString) {
    // Parse chuỗi JSON thành đối tượng
    const authData = JSON.parse(authDataString);

    if (authData && authData.token) {
      // Lấy token từ đối tượng authData
      token = authData.token;
    }
  }

  // Nếu có ảnh thì append ảnh
  // if (request.pickupImage) {
  //   formData.append("pickupImage", request.pickupImage);
  // }

  try {
    const response = await callApi<FormData, unknown>(
      "POST",
      "orders",
      formData,
      true,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

export const confirmOrderPickup = async (request: OrderConfirmPickupRequest): Promise<void> => {
  const formData = new FormData();
  formData.append("trackingCode", request.trackingCode);
  formData.append("paymentStatus", request.paymentStatus);


  if (request.pickupImage) {
    formData.append("pickupImage", request.pickupImage);
  }

  const authDataString = localStorageHelper.getItem<string>("auth_token");
  let token: string = "";
  if (authDataString) {
    const authData = JSON.parse(authDataString);
    if (authData && authData.token) {
      token = authData.token;
    }
  }

  try {
    await callApi<FormData, unknown>(
      "POST",
      "orders/confirm-pickup",
      formData,
      true,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Failed to confirm order pickup:", error);
    throw error;
  }
};

export const confirmOrderPickupDelivery = async (request: OrderConfirmDeliveryRequest): Promise<void> => {
  const formData = new FormData();
  formData.append("trackingCode", request.trackingCode);

  if (request.pickupImage) {
    formData.append("pickupImage", request.pickupImage);
  }

  const authDataString = localStorageHelper.getItem<string>("auth_token");
  let token: string = "";
  if (authDataString) {
    const authData = JSON.parse(authDataString);
    if (authData && authData.token) {
      token = authData.token;
    }
  }

  try {
    await callApi<FormData, unknown>(
      "POST",
      "orders/confirm-pickup-delivery",
      formData,
      true,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Failed to confirm order pickup:", error);
    throw error;
  }
};

export const searchWarehouseLocations = async (
  request: SearchWarehouseLocationsRequest
): Promise<SearchWarehouseLocationsResponse> => {
  try {
    const response = await callApi<
      SearchWarehouseLocationsResponse,
      SearchWarehouseLocationsRequest
    >(
      "POST",
      "warehouse-locations/search",
      request,
      true // Assuming the request needs authentication (auth token)
    );
    return response;
  } catch (error) {
    console.error("Error searching warehouse locations:", error);
    throw error; // Propagate error for further handling
  }
};

export const getAllOrders = async (): Promise<OrderResponse> => {
  try {
    const response = await callApi<OrderResponse>(
      "GET",
      "orders",
      undefined,
      true
    );

    if (response.status === 200 && response.data) {
      return response;
    } else {
      throw new Error(
        "Failed to fetch order information. Invalid response from server."
      );
    }
  } catch (error) {
    console.error("Failed to fetch order information:", error);
    throw error;
  }
};

export const getByManagerOrders = async (): Promise<OrderResponse> => {
  try {
    const response = await callApi<OrderResponse>(
      "GET",
      "orders/manager",
      undefined,
      true
    );

    if (response.status === 200 && response.data) {
      return response;
    } else {
      throw new Error(
        "Failed to fetch order information. Invalid response from server."
      );
    }
  } catch (error) {
    console.error("Failed to fetch order information:", error);
    throw error;
  }
};

export const getByShipperOrders = async (): Promise<OrderResponse> => {
  try {
    const response = await callApi<OrderResponse>(
      "GET",
      "orders/shipper",
      undefined,
      true
    );

    if (response.status === 200 && response.data) {
      return response;
    } else {
      throw new Error(
        "Failed to fetch order information. Invalid response from server."
      );
    }
  } catch (error) {
    console.error("Failed to fetch order information:", error);
    throw error;
  }
};

export const getByCustomerOrders = async (): Promise<OrderResponse> => {
  try {
    const response = await callApi<OrderResponse>(
      "GET",
      "orders/customer",
      undefined,
      true
    );

    if (response.status === 200 && response.data) {
      return response;
    } else {
      throw new Error(
        "Failed to fetch order information. Invalid response from server."
      );
    }
  } catch (error) {
    console.error("Failed to fetch order information:", error);
    throw error;
  }
};

export const assignShipperPickUp = async (
  request: AssignShipperRequest
): Promise<AssignShipperRequest> => {
  try {
    const response = await callApi<
      AssignShipperRequest
    >(
      "POST",
      "orders/assign-shipper",
      request,
      true
    );
    return response;
  } catch (error) {
    console.error("Error assign shipper pick up:", error);
    throw error; // Propagate error for further handling
  }
};

export const assignWarehouse = async (
  request: AssignWarehouseRequest
): Promise<AssignWarehouseRequest> => {
  try {
    const response = await callApi<
      AssignWarehouseRequest
    >(
      "POST",
      "orders/recrived-source",
      request,
      true
    );
    return response;
  } catch (error) {
    console.error("Error assign shipper pick up:", error);
    throw error; // Propagate error for further handling
  }
};

export const assignLeaveWarehouse = async (
  request: AssignWarehouseRequest
): Promise<AssignWarehouseRequest> => {
  try {
    const response = await callApi<
      AssignWarehouseRequest
    >(
      "POST",
      "orders/leaved-source",
      request,
      true
    );
    return response;
  } catch (error) {
    console.error("Error assign shipper pick up:", error);
    throw error; // Propagate error for further handling
  }
};

export const assignDeliveryWarehouse = async (
  request: AssignWarehouseRequest
): Promise<AssignWarehouseRequest> => {
  try {
    const response = await callApi<
      AssignWarehouseRequest
    >(
      "POST",
      "orders/delivery-warehouse",
      request,
      true
    );
    return response;
  } catch (error) {
    console.error("Error assign shipper pick up:", error);
    throw error; // Propagate error for further handling
  }
};

export const assignShipperDelivery = async (
  request: AssignShipperRequest
): Promise<AssignShipperRequest> => {
  try {
    const response = await callApi<
      AssignShipperRequest
    >(
      "POST",
      "orders/assign-shipper-delivery",
      request,
      true
    );
    return response;
  } catch (error) {
    console.error("Error assign shipper pick up:", error);
    throw error; // Propagate error for further handling
  }
};
