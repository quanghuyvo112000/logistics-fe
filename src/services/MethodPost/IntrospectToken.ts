import { callApi } from "../../components/shared/api";
import { IntrospectRequest, IntrospectResponse } from "../../types/auth.types";

export const introspectToken = async (token: string): Promise<IntrospectResponse> => {
  const payload: IntrospectRequest = { token };

  try {
    const response = await callApi<IntrospectResponse, IntrospectRequest>(
      'POST',
      'auth/introspect',
      payload,
      false 
    );

    return response;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    // Nếu callApi quăng lỗi (như 401), xử lý trả ra giống như API định nghĩa
    return {
      status: 401,
      message: 'Invalid or expired token',
      data: false,
    };
  }
};
