/* eslint-disable @typescript-eslint/no-unused-vars */

import { callApi } from "../components/shared/api";
import { IncomeResponse, MonthlyOrderStatusGroupApiResponse, TimeAmountResponse, WarehouseAmountResponse } from "../types/income.type";


export const createIncomeByTrackingCode = async (
  trackingCode: string
): Promise<IncomeResponse> => {
  try {
    const response = await callApi<IncomeResponse>(
      'POST',
      `statistics/${trackingCode}`,
      undefined,
      true
    );

    return response;
  } catch (error: unknown) {
    return {
      status: 500,
      message: 'Failed to create income',
      data: null,
    };
  }
};

// admin - lấy doanh thu theo warehouseId
export const getWarehouseRevenueById = async (warehouseId: string, year: number): Promise<WarehouseAmountResponse> => {
  try {
    const response = await callApi<WarehouseAmountResponse>(
      'GET',
      `statistics/admin/warehouse-amount/${warehouseId}/${year}`,
      undefined,
      true // cần xác thực
    );
    return response;
  } catch (error) {
    console.error(`Error fetching revenue for warehouse ID ${warehouseId}:`, error);
    throw error;
  }
};

// thống kê doanh thu theo tháng (cho DRIVER hoặc WAREHOUSE_MANAGER)
export const getMonthlyStats = async (year: number): Promise<TimeAmountResponse> => {
  try {
    const response = await callApi<TimeAmountResponse>(
      'GET',
      `statistics/monthly/${year}`,
      undefined,
      true
    );
    return response;
  } catch (error) {
    console.error(`Error fetching monthly stats for year ${year}:`, error);
    throw error;
  }
};

// thống kê doanh thu theo quý (cho DRIVER hoặc WAREHOUSE_MANAGER)
export const getQuarterlyStats = async (year: number): Promise<TimeAmountResponse> => {
  try {
    const response = await callApi<TimeAmountResponse>(
      'GET',
      `statistics/quarterly/${year}`,
      undefined,
      true
    );
    return response;
  } catch (error) {
    console.error(`Error fetching quarterly stats for year ${year}:`, error);
    throw error;
  }
};

// thống kê doanh thu theo tháng (cho CUSTOMER)
export const getMonthlyStatsByCustomer = async (year: number): Promise<TimeAmountResponse> => {
  try {
    const response = await callApi<TimeAmountResponse>(
      'GET',
      `statistics/customer/monthly/${year}`,
      undefined,
      true
    );
    return response;
  } catch (error) {
    console.error(`Error fetching monthly stats for year ${year}:`, error);
    throw error;
  }
};

// thống kê doanh thu theo quý (cho CUSTOMER)
export const getQuarterlyStatsByCustomer = async (year: number): Promise<TimeAmountResponse> => {
  try {
    const response = await callApi<TimeAmountResponse>(
      'GET',
      `statistics/customer/quarterly/${year}`,
      undefined,
      true
    );
    return response;
  } catch (error) {
    console.error(`Error fetching quarterly stats for year ${year}:`, error);
    throw error;
  }
};

// CUSTOMER - thống kê đơn hàng theo tháng
export const getMonthlyOrderStatsByCustomer = async (year: number): Promise<MonthlyOrderStatusGroupApiResponse> => {
  try {
    const response = await callApi<MonthlyOrderStatusGroupApiResponse>(
      'GET',
      `statistics/order/customer/monthly/${year}`,
      undefined,
      true
    );
    return response;
  } catch (error) {
    console.error(`Error fetching monthly order stats for year ${year}:`, error);
    throw error;
  }
};

// WAREHOUSE_MANAGER - thống kê đơn hàng theo tháng
export const getMonthlyOrderStatsByWarehouseManager = async (year: number): Promise<MonthlyOrderStatusGroupApiResponse> => {
  try {
    const response = await callApi<MonthlyOrderStatusGroupApiResponse>(
      'GET',
      `statistics/order/warehouse/monthly/${year}`,
      undefined,
      true
    );
    return response;
  } catch (error) {
    console.error(`Error fetching monthly order stats for year ${year}:`, error);
    throw error;
  }
};

// ADMIN - thống kê đơn hàng theo tháng theo warehouse
export const getMonthlyOrderStatsByAdmin = async (warehouseId: string, year: number): Promise<MonthlyOrderStatusGroupApiResponse> => {
  try {
    const response = await callApi<MonthlyOrderStatusGroupApiResponse>(
      'GET',
      `statistics/order/admin/monthly/${warehouseId}/${year}`,
      undefined,
      true
    );
    return response;
  } catch (error) {
    console.error(`Error fetching monthly order stats for year ${year}:`, error);
    throw error;
  }
};
