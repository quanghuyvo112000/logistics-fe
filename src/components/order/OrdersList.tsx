import type React from "react";

import { Search } from "@mui/icons-material";
import {
  Alert,
  Box,
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
import { useSnackbar } from "../../contexts/SnackbarContext";
import {
  assignDeliveryWarehouse,
  assignLeaveWarehouse,
  assignWarehouse,
  getAllOrders,
  getByCustomerOrders,
  getByManagerOrders,
  getByShipperOrders,
} from "../../services/order";
import { AssignWarehouseRequest, Order } from "../../types/order.type";
import authHelper from "../../utils/auth-helper";
import ConfirmDeliveryModal from "./ConfirmDeliveryModal";
import ConfirmPickupModal from "./ConfirmPickupModal";
import OrderRow from "./OrderRow";
import ShipperDeliverySelectModal from "./ShipperDeliverySelectModal";
import ShipperSelectModal from "./ShipperSelectModal";
import { getStatusColor, getStatusLabel } from "./util";

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
  const [openConfirmPickupCode, setOpenConfirmPickupCode] = useState<
    string | null
  >(null);

  const [openModalTrackingDeliveryCode, setOpenModalTrackingDeliveryCode] =
    useState<string | null>(null);
  const [openConfirmDeliveryCode, setOpenConfirmDeliveryCode] = useState<{
    trackingCode: string;
    orderPrice: number;
    shippingFee: number;
  } | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { showMessage } = useSnackbar();

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
      } else if (userRole === "DRIVER") {
        const response = await getByShipperOrders();
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

  const handlePickUpShipperClick = (trackingCode: string) => {
    setOpenModalTrackingCode(trackingCode);
  };

  const handleConfirmPickup = (trackingCode: string) => {
    setOpenConfirmPickupCode(trackingCode);
  };

  const handleConfirmDelivery = (
    trackingCode: string,
    orderPrice: number,
    shippingFee: number
  ) => {
    setOpenConfirmDeliveryCode({ trackingCode, orderPrice, shippingFee });
  };

  const handleConfirmWarehouse = async (trackingCode: string) => {
    const request: AssignWarehouseRequest = {
      trackingCode,
    };
    await assignWarehouse(request);
    showMessage("Cập nhật thành công trạng thái đơn hàng!", "success");
    fetchOrders();
  };

  const handleConfirmLeaveWarehouse = async (trackingCode: string) => {
    const request: AssignWarehouseRequest = {
      trackingCode,
    };
    await assignLeaveWarehouse(request);
    showMessage("Cập nhật thành công trạng thái đơn hàng!", "success");
    fetchOrders();
  };

  const handlePickUpShipperDeliveryClick = (trackingCode: string) => {
    setOpenModalTrackingDeliveryCode(trackingCode);
  };

  const handleConfirmDeliveryWarehouse = async (trackingCode: string) => {
    const request: AssignWarehouseRequest = {
      trackingCode,
    };
    await assignDeliveryWarehouse(request);
    showMessage("Cập nhật thành công trạng thái đơn hàng!", "success");
    fetchOrders();
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
              <TableCell sx={{ minWidth: 300, fontWeight: "bold" }}>
                Mã đơn hàng
              </TableCell>
              <TableCell sx={{ minWidth: 300, fontWeight: "bold" }}>
                Thông tin người gửi
              </TableCell>
              <TableCell sx={{ minWidth: 300, fontWeight: "bold" }}>
                Thông tin người nhận
              </TableCell>
              <TableCell
                sx={{ minWidth: 150, fontWeight: "bold" }}
                align="right"
              >
                Cân nặng (kg)
              </TableCell>
              <TableCell
                sx={{ minWidth: 200, fontWeight: "bold" }}
                align="right"
              >
                Giá trị sản phẩm (VND)
              </TableCell>
              <TableCell
                sx={{ minWidth: 200, fontWeight: "bold" }}
                align="right"
              >
                Cước vận chuyển (VND)
              </TableCell>
              <TableCell
                sx={{ minWidth: 200, fontWeight: "bold" }}
                align="left"
              >
                Trạng thái cước phí
              </TableCell>
              <TableCell
                sx={{ minWidth: 200, fontWeight: "bold" }}
                align="left"
              >
                Trạng thái thanh toán
              </TableCell>
              <TableCell
                sx={{ minWidth: 200, fontWeight: "bold" }}
                align="left"
              >
                Trạng thái đơn hàng
              </TableCell>
              <TableCell sx={{ minWidth: 200, fontWeight: "bold" }}>
                Ngày giao dự kiến
              </TableCell>
              <TableCell sx={{ minWidth: 160, fontWeight: "bold" }}>
                Ngày tạo
              </TableCell>
              <TableCell sx={{ minWidth: 160, fontWeight: "bold" }}>
                Cập nhật
              </TableCell>
              <TableCell sx={{ minWidth: 150, fontWeight: "bold" }}>
                Ảnh nhận hàng
              </TableCell>
              <TableCell sx={{ minWidth: 150, fontWeight: "bold" }}>
                Ảnh giao hàng
              </TableCell>
              {orders.some(
                (order) => order.isSourceWarehouse !== undefined
              ) && (
                <TableCell sx={{ minWidth: 300, fontWeight: "bold" }}>
                  Thông tin thêm
                </TableCell>
              )}
              <TableCell sx={{ minWidth: 200, fontWeight: "bold" }}>
                Chức năng
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order, index) => (
                <OrderRow
                  index={index}
                  key={order.trackingCode}
                  order={order}
                  userRole={userRole}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  getStatusLabel={getStatusLabel}
                  getStatusColor={getStatusColor}
                  handlePickUpShipperClick={handlePickUpShipperClick}
                  handleConfirmWarehouse={handleConfirmWarehouse}
                  handleConfirmLeaveWarehouse={handleConfirmLeaveWarehouse}
                  handleConfirmPickup={handleConfirmPickup}
                  handleConfirmDelivery={handleConfirmDelivery}
                  handleConfirmDeliveryWarehouse={
                    handleConfirmDeliveryWarehouse
                  }
                  handlePickUpShipperDeliveryClick={
                    handlePickUpShipperDeliveryClick
                  }
                />
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
      {/* Modal */}
      {openModalTrackingCode && (
        <ShipperSelectModal
          trackingCode={openModalTrackingCode}
          onClose={() => setOpenModalTrackingCode(null)}
          fetchOrders={fetchOrders}
        />
      )}

      {openConfirmPickupCode && (
        <ConfirmPickupModal
          trackingCode={openConfirmPickupCode}
          onClose={() => setOpenConfirmPickupCode(null)}
          fetchOrders={fetchOrders}
        />
      )}

      {openModalTrackingDeliveryCode && (
        <ShipperDeliverySelectModal
          trackingCode={openModalTrackingDeliveryCode}
          onClose={() => setOpenModalTrackingDeliveryCode(null)}
          fetchOrders={fetchOrders}
        />
      )}

      {openConfirmDeliveryCode && (
        <ConfirmDeliveryModal
          trackingCode={openConfirmDeliveryCode.trackingCode}
          orderPrice={openConfirmDeliveryCode.orderPrice}
          shippingFee={openConfirmDeliveryCode.shippingFee}
          onClose={() => setOpenConfirmDeliveryCode(null)}
          fetchOrders={fetchOrders}
        />
      )}
    </Box>
  );
};

export default OrdersList;
