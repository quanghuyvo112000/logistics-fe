import React, { useCallback, useEffect, useState } from "react";
import {
  getMonthlyOrderStatsByAdmin,
  getMonthlyOrderStatsByCustomer,
  getMonthlyOrderStatsByWarehouseManager,
  getMonthlyStats,
  getMonthlyStatsByCustomer,
  getQuarterlyStats,
  getQuarterlyStatsByCustomer,
  getWarehouseRevenueById,
} from "../../services/income";
import { getAllWarehouse } from "../../services/warehouse";
import {
  ChartData,
  MonthlyOrderStatusGroupResponse,
  StatType,
  TimeAmount,
  WarehouseAmount,
} from "../../types/income.type";
import authHelper from "../../utils/auth-helper";
import { hideLoading, showLoading } from "../shared/loadingHandler";
import DataTable from "./DataTable";
import ErrorDisplay from "./ErrorDisplay";
import FilterControls from "./FilterControls";
import NoDataMessage from "./NoDataMessage";
import RevenueChartDisplay from "./RevenueChartDisplay";
import SummaryStats from "./SummaryStats";
import { getChartTitle } from "./utils";
import OrderStatsCards from "./OrderStatsCards";

interface Warehouse {
  id: string;
  name: string;
}

const RevenueChart: React.FC = () => {
  const [data, setData] = useState<TimeAmount[]>([]);
  const [warehouseData, setWarehouseData] = useState<WarehouseAmount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [statType, setStatType] = useState<StatType>("monthly");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(""); // id kiểu string
  const [availableWarehouses, setAvailableWarehouses] = useState<Warehouse[]>(
    []
  );
  const [orderStats, setOrderStats] =
    useState<MonthlyOrderStatusGroupResponse | null>(null);

  const userRole = authHelper.getUserRole() as
    | "ADMIN"
    | "WAREHOUSE_MANAGER"
    | "CUSTOMER"
    | "DRIVER"
    | null;

  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear - 2, currentYear - 1, currentYear];

  // Lấy danh sách kho từ API khi component mount
  useEffect(() => {
    if (userRole === "ADMIN") {
      const fetchWarehouses = async () => {
        try {
          showLoading("Đang tải thống kê...");
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const response = await getAllWarehouse();
          if (response.status === 200 && Array.isArray(response.data)) {
            setAvailableWarehouses(
              response.data.map((w) => ({ id: w.id, name: w.name }))
            );
            // Mặc định chọn kho đầu tiên nếu chưa chọn
            if (!selectedWarehouseId && response.data.length > 0) {
              setSelectedWarehouseId(response.data[0].id);
            }
          } else {
            setError("Không thể tải danh sách kho");
          }
        } catch (err) {
          setError("Lỗi khi tải danh sách kho");
          console.error(err);
        } finally {
          hideLoading();
        }
      };

      fetchWarehouses();
    }
  }, [userRole, selectedWarehouseId]);

  // API call functions

  const fetchTimeBasedData = useCallback(
    async (year: number, type: "monthly" | "quarterly") => {
      showLoading("Đang tải thống kê...");
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (userRole === "DRIVER" || userRole === "WAREHOUSE_MANAGER") {
        try {
          const response =
            type === "monthly"
              ? await getMonthlyStats(year)
              : await getQuarterlyStats(year);

          if (response.status === 200 && response.data) {
            setData(response.data);
            setWarehouseData([]);
          } else {
            setError(response.message || "Không thể tải dữ liệu");
            setData([]);
          }
        } catch (err) {
          setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
          console.error(`Error fetching ${type} stats:`, err);
          setData([]);
        } finally {
          hideLoading();
        }
      } else if (userRole === "CUSTOMER") {
        try {
          const response =
            type === "monthly"
              ? await getMonthlyStatsByCustomer(year)
              : await getQuarterlyStatsByCustomer(year);

          if (response.status === 200 && response.data) {
            setData(response.data);
            setWarehouseData([]);
          } else {
            setError(response.message || "Không thể tải dữ liệu");
            setData([]);
          }
        } catch (err) {
          setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
          console.error(`Error fetching ${type} stats:`, err);
          setData([]);
        } finally {
          hideLoading();
        }
      }
    },
    [userRole]
  );

  const fetchWarehouseData = useCallback(
    async (warehouseId: string, selectedYear: number) => {
      showLoading("Đang tải thống kê...");
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const response = await getWarehouseRevenueById(
          warehouseId,
          selectedYear
        );

        if (response.status === 200 && response.data) {
          setWarehouseData(response.data);
          setData([]); // clear other data
        } else {
          setError(response.message || "Không thể tải dữ liệu kho");
          setWarehouseData([]);
        }
      } catch (err) {
        setError("Không thể tải dữ liệu kho. Vui lòng thử lại sau.");
        console.error("Error fetching warehouse data:", err);
        setWarehouseData([]);
      } finally {
        hideLoading();
      }
    },
    [] // hoặc thêm các dependencies cần thiết nếu có, ví dụ: [getWarehouseRevenueById]
  );

  const getChartData = (): ChartData[] => {
    if (statType === "warehouse") {
      return warehouseData.map((item) => ({
        time: item.time,
        amount: item.amount,
      }));
    }
    return data;
  };

  const chartData = getChartData();

  useEffect(() => {
    if (statType === "warehouse") {
      if (selectedWarehouseId) {
        fetchWarehouseData(selectedWarehouseId, selectedYear);
      }
    } else {
      fetchTimeBasedData(selectedYear, statType);
    }
  }, [
    selectedYear,
    statType,
    selectedWarehouseId,
    fetchWarehouseData,
    fetchTimeBasedData,
  ]);

  useEffect(() => {
    const fetchOrderStats = async () => {
      if (
        userRole !== "CUSTOMER" &&
        userRole !== "WAREHOUSE_MANAGER" &&
        userRole !== "ADMIN"
      )
        return;

      try {
        showLoading("Đang tải thống kê đơn hàng...");
        setError(null);
        await new Promise((r) => setTimeout(r, 800));

        let response;

        if (userRole === "CUSTOMER") {
          response = await getMonthlyOrderStatsByCustomer(selectedYear);
        } else if (userRole === "WAREHOUSE_MANAGER") {
          response = await getMonthlyOrderStatsByWarehouseManager(selectedYear);
        } else if (userRole === "ADMIN" && selectedWarehouseId) {
          response = await getMonthlyOrderStatsByAdmin(
            selectedWarehouseId,
            selectedYear
          );
        }

        if (response?.status === 200 && response.data) {
          setOrderStats(response.data);
        } else {
          setError(response?.message || "Không thể tải thống kê đơn hàng");
          setOrderStats(null);
        }
      } catch (err) {
        setError("Lỗi khi tải thống kê đơn hàng");
        console.error(err);
      } finally {
        hideLoading();
      }
    };

    fetchOrderStats();
  }, [selectedYear, selectedWarehouseId, userRole]);

  const handleRetry = () => {
    if (statType === "warehouse") {
      if (selectedWarehouseId)
        fetchWarehouseData(selectedWarehouseId, selectedYear);
    } else {
      fetchTimeBasedData(selectedYear, statType);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {getChartTitle(statType)}
        </h2>

        <FilterControls
          statType={statType}
          selectedYear={selectedYear}
          selectedWarehouseId={selectedWarehouseId}
          availableYears={availableYears}
          availableWarehouses={availableWarehouses}
          onStatTypeChange={setStatType}
          onYearChange={setSelectedYear}
          onWarehouseChange={setSelectedWarehouseId}
        />
      </div>

      {error ? (
        <ErrorDisplay error={error} onRetry={handleRetry} />
      ) : chartData.length > 0 ? (
        <>
          {userRole !== "DRIVER" && <OrderStatsCards data={orderStats} />}

          <RevenueChartDisplay data={chartData} />
          <SummaryStats data={chartData} />
          <DataTable
            data={data}
            warehouseData={warehouseData}
            statType={statType}
          />
        </>
      ) : (
        <NoDataMessage />
      )}
    </div>
  );
};

export default RevenueChart;
