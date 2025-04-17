import { callApi } from "../../components/shared/api";
import { RefreshTokenApiResponse } from "../../types/auth.types";

export const refreshToken = async (token: string): Promise<string> => {
  const response = await callApi<RefreshTokenApiResponse, { token: string }>(
    'POST',
    'auth/refresh-token',
    { token },
    false
  );

  // Trả về token mới
  return response.data;
};
