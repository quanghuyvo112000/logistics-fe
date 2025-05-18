export interface LoginResponse {
  data: string;
  message: string;
  status: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutResponse {
  message: string;
  status: number;
}

export interface LogoutRequest {
  token: string;
}

export interface IntrospectRequest {
  token: string;
}

export interface IntrospectResponse {
  status: number;
  message: string;
  data: boolean;
}

export interface changePWRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface ChangePWResponse {
  status: number;
  message: string;
  data: string; // hoặc null nếu không trả dữ liệu
}

export interface RefreshTokenApiResponse {
  status: number;
  message: string;
  data: string;
}