import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getWarehouse } from "../../services/warehouse";
import { convertVehicleType } from "../../utils/moneyFormat";
import { hideLoading, showLoading } from "../shared/loadingHandler";

const DriversVehicleTable = () => {
  const [vehicles, setVehicles] = useState<
    { fullName: string; vehicleType: string; vehiclePlate: string }[]
  >([]);

  const fetchVehicleData = async () => {
    showLoading("Đang tải danh sách phương tiện...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await getWarehouse();
      if (response.status === 200 && Array.isArray(response.data?.drivers)) {
        const driverVehicles = response.data.drivers.map((driver) => ({
          fullName: driver.fullName,
          vehicleType: convertVehicleType(driver.vehicleType),
          vehiclePlate: driver.vehiclePlate,
        }));
        setVehicles(driverVehicles);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tài xế", error);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  return (
    <Paper sx={{ padding: 2, marginTop: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Danh sách phương tiện tài xế
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Họ tên</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Loại phương tiện</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Biển số xe</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.vehicleType}</TableCell>
              <TableCell>{item.vehiclePlate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DriversVehicleTable;
