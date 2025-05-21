import { callApi } from "../components/shared/api";
import { HistoryOrderRequest, HistoryOrderResponse } from "../types/history";

export const fetchHistoryOrder = async (
  payload: HistoryOrderRequest
): Promise<HistoryOrderResponse> => {
  const response = await callApi<HistoryOrderResponse>(
    'GET',
    `history/${payload.trackingCode}`,
    undefined,
    false
  );
  return response;
};
