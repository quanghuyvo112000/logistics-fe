import type React from "react";

import { Menu, Search } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Collapse,
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
import ConfirmPickupModal from "./ConfirmPickupModal";
import ShipperSelectModal from "./ShipperSelectModal";
import { getStatusColor, getStatusLabel } from "./util";
import ConfirmDeliveryModal from "./ConfirmDeliveryModal";
import ShipperDeliverySelectModal from "./ShipperDeliverySelectModal";

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
  const [openConfirmDeliveryCode, setOpenConfirmDeliveryCode] = useState<
    string | null
  >(null);
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

  const handleConfirmDelivery = (trackingCode: string) => {
    setOpenConfirmDeliveryCode(trackingCode);
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
              <TableCell sx={{ minWidth: 300 }}>Mã đơn hàng</TableCell>
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
              <TableCell sx={{ minWidth: 100 }}>Ngày tạo</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Cập nhật</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Ảnh nhận hàng</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Ảnh giao hàng</TableCell>
              {orders.some(
                (order) => order.isSourceWarehouse !== undefined
              ) && <TableCell sx={{ minWidth: 300 }}>Thông tin thêm</TableCell>}
              <TableCell sx={{ minWidth: 200 }}>Chức năng</TableCell>
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
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {new Date(order.updatedAt).toLocaleString("vi-VN")}
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
                  <TableCell>
                    <Box>
                      <ButtonGroup
                        variant="contained"
                        disabled={
                          userRole !== "WAREHOUSE_MANAGER" &&
                          userRole !== "DRIVER"
                        }
                      >
                        <Button
                          onClick={() =>
                            setOpenDropdown((prev) =>
                              prev === order.trackingCode
                                ? null
                                : order.trackingCode
                            )
                          }
                        >
                          <Menu />
                        </Button>
                      </ButtonGroup>

                      {/* Dropdown nút phụ */}
                      <Collapse in={openDropdown === order.trackingCode}>
                        <Box
                          mt={1}
                          display="flex"
                          flexDirection="column"
                          gap={1}
                        >
                          {userRole === "WAREHOUSE_MANAGER" &&
                            order.warehouseManagerRole === "sourceWarehouseManager" && [
                              "CREATED",
                              "ASSIGNED_TO_SHIPPER",
                              "PICKED_UP_SUCCESSFULLY",
                              "RECEIVED_AT_SOURCE",
                            ].includes(order.status) &&(
                              <>
                                <Button
                                  variant="outlined"
                                  color="info"
                                  size="small"
                                  disabled={[
                                    "ASSIGNED_TO_SHIPPER",
                                    "PICKED_UP_SUCCESSFULLY",
                                  ].includes(order.status) ||
                                      !order.isPickupDriverNull||
                                    order.isSourceWarehouse === false
                                  }
                                  onClick={() =>
                                    handlePickUpShipperClick(order.trackingCode)
                                  }
                                >
                                  Chọn shipper
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  disabled={[
                                    "CREATED",
                                    "RECEIVED_AT_SOURCE",
                                    "ASSIGNED_TO_SHIPPER",
                                    "LEFT_SOURCE",
                                  ].includes(order.status)}
                                  onClick={() =>
                                    handleConfirmWarehouse(order.trackingCode)
                                  }
                                >
                                  Đã đến kho nhận
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="warning"
                                  size="small"
                                  disabled={[
                                    "CREATED",
                                    "PICKED_UP_SUCCESSFULLY",
                                    "ASSIGNED_TO_SHIPPER",
                                    "LEFT_SOURCE",
                                  ].includes(order.status)}
                                  onClick={() =>
                                    handleConfirmLeaveWarehouse(
                                      order.trackingCode
                                    )
                                  }
                                >
                                  Rời kho nhận
                                </Button>
                              </>
                            )}

                          {userRole === "DRIVER" && (
                            <>
                              <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                disabled={order.isDeliveryDriverNull == false || order.pickupImage != null}
                                onClick={() =>
                                  handleConfirmPickup(order.trackingCode)
                                }
                              >
                                Lấy hàng
                              </Button>
                              <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                disabled={order.isDeliveryDriverNull != false || order.deliveryImage != null}
                                onClick={() =>
                                  handleConfirmDelivery(order.trackingCode)
                                }
                
                              >
                                Giao hàng
                              </Button>
                            </>
                          )}

                          {userRole === "WAREHOUSE_MANAGER" &&
                            order.warehouseManagerRole ===
                              "sourceWarehouseManager" &&
                              [
                                "LEFT_SOURCE",
                                "AT_DESTINATION",
                                "OUT_FOR_DELIVERY",
                              ].includes(order.status) && (
                              <>
                                <Button
                                  variant="outlined"
                                  color="success"
                                  size="small"
                                  disabled={["AT_DESTINATION", "OUT_FOR_DELIVERY"].includes(
                                    order.status
                                  )}
                                  onClick={() =>
                                    handleConfirmDeliveryWarehouse(
                                      order.trackingCode
                                    )
                                  }
                                >
                                  Đến kho giao
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="success"
                                  size="small"
                                  disabled={["LEFT_SOURCE", "OUT_FOR_DELIVERY"].includes(
                                    order.status
                                  )}
                                  onClick={() =>
                                    handlePickUpShipperDeliveryClick(
                                      order.trackingCode
                                    )
                                  }
                                >
                                  Shipper giao hàng
                                </Button>
                              </>
                            )}

                          {userRole === "WAREHOUSE_MANAGER" && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={() => {
                                console.log("In đơn:", order.trackingCode);
                              }}
                            >
                              In hóa đơn
                            </Button>
                          )}
                        </Box>
                      </Collapse>
                    </Box>
                  </TableCell>
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
          trackingCode={openConfirmDeliveryCode}
          onClose={() => setOpenConfirmDeliveryCode(null)}
          fetchOrders={fetchOrders}
        />
      )}
    </Box>
  );
};

export default OrdersList;
