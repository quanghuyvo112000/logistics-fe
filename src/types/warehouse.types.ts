export interface Driver {
  fullName: string;
  phone: string;
  email: string;
  birthday: string;
  role: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  vehicleType: string;
  vehiclePlate: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Manager {
  fullName: string;
  email: string;
  birthday: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  role: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  phone: string;
  province: string;
  district: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  manager: Manager;
  drivers: Driver[];
}

export interface WarehouseResponse {
  status: number;
  message: string;
  data: Warehouse;
}

export interface WarehouseListResponse {
  status: number;
  message: string;
  data: Warehouse[];
}

export interface CreateWarehousePayload {
  fullName: string;
  birthday: string | Date;
  email: string;
  phone: string;
  password: string;
  province: string;
  district: string;
  ward: string;
  address: string;
}

export interface CreateWarehouseResponse {
  message: string;
  status: number;
  data: Record<string, unknown>;
}

export interface CreateDriverPayload {
  fullName: string;
  birthday: string | Date;
  gmail: string;
  phone: string;
  password: string;
  vehicleType: string;
  vehiclePlate: string;
}

export interface CreateDriverResponse {
  message: string;
  status: number;
  data: Record<string, unknown>;
}

export type WarehouseItem = Warehouse

export interface SearchWarehouseLocationsRequest {
  province: string;
  district: string;
}
export interface WarehouseLocation {
  id: string;
  warehouseName: string;
}

export interface SearchWarehouseLocationsResponse {
  status: number;
  message: string;
  data: WarehouseLocation[];
}
