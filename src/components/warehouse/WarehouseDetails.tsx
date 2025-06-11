import {
  PeopleAlt as DirectionsCarIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { Warehouse } from "../../types/warehouse.types";
import AddManagerModal from "./AddManagerModal";
import { localStorageHelper } from "../shared/localStorageHelper";
import AddDriverModal from "./AddDriverModal";
import { convertVehicleType } from "../../utils/moneyFormat";

const WarehouseDetails = ({
  warehouse,
  fetchWarehouses,
}: {
  warehouse: Warehouse;
  fetchWarehouses: () => void;
}) => {
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] =
    useState<boolean>(false);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] =
    useState<boolean>(false);

  const handleOpenManagerModal = () => setIsAddManagerModalOpen(true);
  const handleCloseManagerModal = () => setIsAddManagerModalOpen(false);

  const handleOpenDriverModal = () => setIsAddDriverModalOpen(true);
  const handleCloseDriverModal = () => setIsAddDriverModalOpen(false);

  const authDataString = localStorageHelper.getItem<string>("auth_token");
  const authData = JSON.parse(authDataString || "{}");
  const role = authData.role;

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const formatAddress = (warehouse: Warehouse): string => {
    return [warehouse.address, warehouse.district, warehouse.province]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Box sx={{ margin: 1 }}>
      <Typography variant="h6" gutterBottom component="div">
        Thông tin chi tiết kho
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1,
                py: 1,
                mb: 2,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                <LocationOnIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
                Thông tin vị trí
              </Typography>
            </Box>
            <Box sx={{ ml: 4 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Địa chỉ đầy đủ:</strong> {formatAddress(warehouse)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Điện thoại liên hệ:</strong> {warehouse.phone}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Tạo ngày:</strong> {formatDate(warehouse.createdAt)}
              </Typography>
              <Typography variant="body2">
                <strong>Cập nhật:</strong> {formatDate(warehouse.updatedAt)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1,
                py: 1,
                mb: 2,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                <PersonIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
                Thông tin quản lý
              </Typography>

              <Button
                disabled={!!warehouse.manager || role !== "ADMIN"}
                variant="contained"
                size="small"
                onClick={handleOpenManagerModal}
              >
                Thêm quản lý
              </Button>

              <AddManagerModal
                open={isAddManagerModalOpen}
                onClose={handleCloseManagerModal}
                data={warehouse.id}
                fetchWarehouses={fetchWarehouses}
              />
            </Box>

            <Box sx={{ ml: 4 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Họ và tên:</strong>{" "}
                {warehouse.manager?.fullName ?? "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email:</strong> {warehouse.manager?.email ?? "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Số điện thoại:</strong>{" "}
                {warehouse.manager?.phone ?? "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Ngày sinh:</strong>{" "}
                {formatDate(warehouse.manager?.birthday ?? null)}
              </Typography>
              <Typography variant="body2">
                <strong>Địa chỉ hiện tại:</strong>{" "}
                {[
                  warehouse.manager?.address ?? "N/A",
                  warehouse.manager?.ward ?? "N/A",
                  warehouse.manager?.district ?? "N/A",
                  warehouse.manager?.province ?? "N/A",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1,
                py: 1,
                mb: 2,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                <DirectionsCarIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
                Nhân viên giao hàng ({warehouse.drivers.length})
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleOpenDriverModal}
              >
                Thêm nhân viên
              </Button>
              <AddDriverModal
                open={isAddDriverModalOpen}
                onClose={handleCloseDriverModal}
                data={warehouse.id}
                fetchWarehouses={fetchWarehouses}
              />
            </Box>

            {warehouse.drivers.length > 0 ? (
              <TableContainer
                component={Paper}
                elevation={0}
                variant="outlined"
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Tên</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Liên lạc
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Phương tiện giao thông
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Địa chỉ hiện tại
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {warehouse.drivers.map((driver, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography variant="body2">
                            {driver?.fullName ?? "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Sinh ngày: {formatDate(driver?.birthday ?? null)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />{" "}
                            {driver?.phone ?? "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {driver?.email ?? "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {convertVehicleType(driver?.vehicleType ?? "N/A")}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Số xe: {driver?.vehiclePlate ?? "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 600 }}
                          >
                            {[
                              driver?.address ?? "N/A",
                              driver?.ward ?? "N/A",
                              driver?.district ?? "N/A",
                              driver?.province ?? "N/A",
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No drivers assigned to this warehouse.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WarehouseDetails;
