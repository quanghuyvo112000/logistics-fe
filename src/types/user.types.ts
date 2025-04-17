export interface CreateUserPayload {
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

export interface CreateManagerPayload extends CreateUserPayload {
  warehouseId: string;
}

export interface CreateDriverPayload extends CreateUserPayload {
  warehouseId: string;
  vehicleType: string;
  vehiclePlate: string;
}

export interface CreateUserResponse {
  message: string;
  status: number;
  data: Record<string, unknown>;
}

export interface UpdateUserRequest {
  fullName: string;
  birthday: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
}

export interface UpdateUserResponse {
  data: {
    fullName: string;
    birthday: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    updatedAt: string;
  };
  message: string;
  status: number;
}

export interface UserInfoResponse {
  data: {
    fullName: string;
    email: string;
    phone: string;
    birthday: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  status: number;
}

export interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
  birthday: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}