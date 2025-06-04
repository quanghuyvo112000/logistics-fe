import React, { useEffect, useState, useCallback } from "react";
import FilterControls from "./FilterControls";
import ErrorDisplay from "./ErrorDisplay";
import RevenueChartDisplay from "./RevenueChartDisplay";
import SummaryStats from "./SummaryStats";
import DataTable from "./DataTable";
import {
  ChartData,
  StatType,
  TimeAmount,
  WarehouseAmount,
} from "../../types/income.type";
import { getAllWarehouse } from "../../services/warehouse";
import {
  getMonthlyStats,
  getQuarterlyStats,
  getWarehouseRevenueById,
} from "../../services/income";
import { getChartTitle } from "./utils";
import NoDataMessage from "./NoDataMessage";
import authHelper from "../../utils/auth-helper";
import { hideLoading, showLoading } from "../shared/loadingHandler";

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

  const userRole = authHelper.getUserRole() as
    | "ADMIN"
    | "WAREHOUSE_MANAGER"
    | "CUSTOMER"
    | "DRIVER"
    | null;

  const availableYears = [2023, 2024, 2025];

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
