import type React from "react";

import { Search } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  getAllOrders,
  getByCustomerOrders,
  getByManagerOrders,
} from "../../services/order";
import { Order } from "../../types/order.type";
import authHelper from "../../utils/auth-helper";
import ShipperSelectModal from "./ShipperSelectModal";

interface OrdersListProps {
  onRefreshRef?: React.MutableRefObject<(() => void) | undefined>;
}

const OrdersList = ({ onRefreshRef }: OrdersListProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModalTrackingCode, setOpenModalTrackingCode] = useState<
    string | null
  >(null);

  const userRole = authHelper.getUserRole() as
    | "ADMIN"
    | "WAREHOUSE_MANAGER"
    | "CUSTOMER"
    | "DRIVER"
    | null;

  const fetchOrders = useCallback(async () => {
    try {
      if (userRole === "ADMIN") {
        const response = await getAllOrders();
        setOrders(response.data);
        setError(null);
      } else if (userRole === "WAREHOUSE_MANAGER") {
        const response = await getByManagerOrders();
        setOrders(response.data);
        setError(null);
      } else if (userRole === "CUSTOMER") {
        const response = await getByCustomerOrders();
        setOrders(response.data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      console.error(err);
    }
  }, [userRole]);

  useEffect(() => {
    if (onRefreshRef) {
      onRefreshRef.current = fetchOrders;
    }
  }, [fetchOrders, onRefreshRef]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const getStatusColor = (
    status: string
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (status) {
      case "CREATED":
        return "default";
      case "RECEIVED_AT_SOURCE":
        return "info";
      case "ASSIGNED_TO_SHIPPER":
        return "info";
      case "LEFT_SOURCE":
        return "info";
      case "AT_INTERMEDIATE":
        return "warning";
      case "LEFT_INTERMEDIATE":
        return "warning";
      case "AT_DESTINATION":
        return "primary";
      case "OUT_FOR_DELIVERY":
        return "secondary";
      case "DELIVERED_SUCCESSFULLY":
        return "success";
      case "DELIVERY_FAILED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CREATED":
        return "Đã tạo";
      case "RECEIVED_AT_SOURCE":
        return "Đã nhận tại kho nguồn";
      case "ASSIGNED_TO_SHIPPER":
        return "Đã giao cho shipper";
      case "LEFT_SOURCE":
        return "Đã rời kho nguồn";
      case "AT_INTERMEDIATE":
        return "Tại kho trung gian";
      case "LEFT_INTERMEDIATE":
        return "Đã rời kho trung gian";
      case "AT_DESTINATION":
        return "Tại kho đích";
      case "OUT_FOR_DELIVERY":
        return "Đang giao hàng";
      case "DELIVERED_SUCCESSFULLY":
        return "Giao hàng thành công";
      case "DELIVERY_FAILED":
        return "Giao hàng thất bại";
      default:
        return status;
    }
  };

  const handleButtonClick = (trackingCode: string) => {
    setOpenModalTrackingCode(trackingCode);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.receiverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo mã đơn, tên khách hàng hoặc người nhận..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
        component={Paper}
      >
        <Table sx={{ minWidth: 1200 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell sx={{ minWidth: 300 }}>Thông tin người gửi</TableCell>
              <TableCell sx={{ minWidth: 300 }}>Thông tin người nhận</TableCell>
              <TableCell sx={{ minWidth: 150 }} align="right">
                Cân nặng (kg)
              </TableCell>
              <TableCell sx={{ minWidth: 150 }} align="right">
                Giá (VND)
              </TableCell>
              <TableCell sx={{ minWidth: 150 }} align="center">
                Trạng thái
              </TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Cập nhật</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Ảnh nhận hàng</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Ảnh giao hàng</TableCell>
              {orders.some(
                (order) => order.isSourceWarehouse !== undefined
              ) && <TableCell sx={{ minWidth: 160 }}>Thông tin thêm</TableCell>}
              {orders.some(
                (order) => order.isSourceWarehouse !== undefined
              ) && <TableCell sx={{ minWidth: 200 }}>Chức năng</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => (
                <TableRow key={order.trackingCode} hover>
                  <TableCell component="th" scope="row">
                    {order.trackingCode}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.senderName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.senderAddress} - SĐT: {order.senderPhone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.receiverName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.receiverAddress} - SĐT: {order.receiverPhone}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{order.weight} kg</TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat("vi-VN").format(
                      order.orderPrice + order.shippingFee
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={getStatusLabel(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {new Date(order.updatedAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {order.pickupImage ? (
                      <img
                        src={`data:image/jpeg;base64,${order.pickupImage}`}
                        alt="Delivery"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <span>Chưa tải lên</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.deliveryImage ? (
                      <img
                        src={`data:image/jpeg;base64,${order.deliveryImage}`}
                        alt="Delivery"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <span>Chưa tải lên</span>
                    )}
                  </TableCell>
                  {order.isSourceWarehouse !== undefined && (
                    <TableCell>
                      {order.isSourceWarehouse
                        ? "Đơn hàng thuộc kho bạn quản lý"
                        : "Đơn hàng chưa đến kho bạn quản lý"}
                    </TableCell>
                  )}
                  {order.isSourceWarehouse !== undefined && (
                    <TableCell>
                      {order.isSourceWarehouse ? (
                        <Button
                          disabled={
                            userRole !== "WAREHOUSE_MANAGER" ||
                            order.isPickupDriverNull === false
                          }
                          variant="contained"
                          color="primary"
                          onClick={() => handleButtonClick(order.trackingCode)}
                        >
                          Chọn shipper
                        </Button>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Kho không phải của bạn
                        </Typography>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="h6">Không có đơn hàng nào</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {openModalTrackingCode && (
        <ShipperSelectModal
          trackingCode={openModalTrackingCode}
          onClose={() => setOpenModalTrackingCode(null)}
        />
      )}
    </Box>
  );
};

export default OrdersList;
