
export interface HistoryOrderRequest {
    trackingCode: string;
}

export interface OrderHistoryItem {
  status: string;
  timestamp: string;
}

export interface HistoryOrderData {
  trackingCode: string;
  histories: OrderHistoryItem[];
}

export interface HistoryOrderResponse {
  status: number;
  message: string;
  data: HistoryOrderData;
}

