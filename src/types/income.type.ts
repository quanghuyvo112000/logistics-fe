export interface Income {
  amount: number;
  type: "COMMISSION" | "SHIPPING_FEE";
  createdAt: string; // ISO string format
}

export interface IncomeResponse {
  status: number;
  message: string;
  data: Income | null;
}

export interface TimeAmount {
  time: string;
  amount: number;
}

export interface TimeAmountResponse {
  status: number;
  message: string;
  data: TimeAmount[] | null;
}



export interface WarehouseAmount {
  time: string;
  amount: number;
}

export interface WarehouseAmountResponse {
  status: number;
  message: string;
  data: WarehouseAmount[] | null;
}

export type StatType = 'monthly' | 'quarterly' | 'warehouse';

export interface ChartData {
  time: string;
  amount: number;
}