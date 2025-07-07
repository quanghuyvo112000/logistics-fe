/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Container,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { getAllWarehouse, getWarehouse } from "../../services/warehouse";
import authHelper from "../../utils/auth-helper";
import { convertVehicleType } from "../../utils/moneyFormat";
import { hideLoading, showLoading } from "../shared/loadingHandler";
import { Driver } from "./interface.type";

const DriversTable: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [warehouseName, setWarehouseName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const userRole = authHelper.getUserRole() as
    | "ADMIN"
    | "WAREHOUSE_MANAGER"
    | null;

  const fetchDriversForManager = async () => {
    showLoading("Đang tải danh sách tài xế...");
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await getWarehouse();
      if (response.status === 200 && response.data?.drivers) {
        setDrivers(response.data.drivers);
        setWarehouseName(response.data.name || "");
      } else {
        setError("Không thể tải danh sách tài xế.");
      }
    } catch (err) {
      setError("Lỗi khi tải danh sách tài xế.");
    } finally {
      hideLoading();
    }
  };

  const fetchAllDriversForAdmin = async () => {
    showLoading("Đang tải danh sách tài xế từ tất cả kho...");
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await getAllWarehouse();
      if (response.status === 200 && Array.isArray(response.data)) {
        // Gán thêm tên kho cho từng driver
        const allDriversWithWarehouse = response.data.flatMap((warehouse) =>
          (warehouse.drivers || []).map((driver) => ({
            ...driver,
            warehouseName: warehouse.name, // Thêm trường warehouseName
          }))
        );
        setDrivers(allDriversWithWarehouse);
      } else {
        setError("Không thể tải danh sách tài xế từ tất cả kho.");
      }
    } catch (err) {
      setError("Lỗi khi tải danh sách tài xế từ tất cả kho.");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (userRole === "WAREHOUSE_MANAGER") {
      fetchDriversForManager();
    } else if (userRole === "ADMIN") {
      fetchAllDriversForAdmin();
    }
  }, [userRole]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter(
      (driver) =>
        driver.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone?.includes(searchTerm)
    );
  }, [drivers, searchTerm]);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Box sx={{ width: "100%" }}>
        <Paper>
          <Box sx={{ mb: 2, mx: 2 }}>
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Quản lý tài xế
                </Typography>
              </Box>
            </Box>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng hoặc người nhận..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <TableContainer
              sx={{
                width: "100%",
                overflowX: "auto",
              }}
              component={Paper}
            >
              <Table sx={{ minWidth: 100 }} aria-label="orders table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
                      Họ tên
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
                      Điện thoại
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
                      Ngày sinh
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
                      Phương tiện
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
                      Biển số
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 300 }}>
                      Địa chỉ thường trú
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: 300 }}>
                      Kho hàng
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Không tìm thấy tài xế nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrivers.map((driver, index) => (
                      <TableRow key={index}>
                        <TableCell>{driver.fullName}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>
                          {new Date(driver.birthday).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {convertVehicleType(driver.vehicleType)}
                        </TableCell>
                        <TableCell>{driver.vehiclePlate}</TableCell>
                        <TableCell>{`${driver.address}, ${driver.ward}, ${driver.district}, ${driver.province}`}</TableCell>
                        <TableCell>
                          {driver.warehouseName || warehouseName || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DriversTable;
