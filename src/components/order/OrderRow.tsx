/* eslint-disable @typescript-eslint/no-explicit-any */
// components/OrderRow.tsx
import { Menu } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Collapse,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { getPaymentStatusLabel, getPaymentStatusColor } from "./util";

interface OrderRowProps {
  order: any;
  userRole: string | null;
  openDropdown: string | null;
  setOpenDropdown: (value: string | null) => void;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => any;
  handlePickUpShipperClick: (code: string) => void;
  handleConfirmWarehouse: (code: string) => void;
  handleConfirmLeaveWarehouse: (code: string) => void;
  handleConfirmPickup: (code: string) => void;
  handleConfirmDelivery: (code: string) => void;
  handleConfirmDeliveryWarehouse: (code: string) => void;
  handlePickUpShipperDeliveryClick: (code: string) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({
  order,
  userRole,
  openDropdown,
  setOpenDropdown,
  getStatusLabel,
  getStatusColor,
  handlePickUpShipperClick,
  handleConfirmWarehouse,
  handleConfirmLeaveWarehouse,
  handleConfirmPickup,
  handleConfirmDelivery,
  handleConfirmDeliveryWarehouse,
  handlePickUpShipperDeliveryClick,
}) => {
  return (
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
        <Typography variant="body2">{order.receiverName}</Typography>
        <Typography variant="body2" color="textSecondary">
          {order.receiverAddress} - SĐT: {order.receiverPhone}
        </Typography>
      </TableCell>
      <TableCell align="right">{order.weight} kg</TableCell>
      <TableCell align="right">
        {new Intl.NumberFormat("vi-VN").format(order.orderPrice)}
      </TableCell>
      <TableCell align="right">
        {new Intl.NumberFormat("vi-VN").format(order.shippingFee)}
      </TableCell>
      <TableCell align="left">
        <Chip 
          label={getPaymentStatusLabel(order.paymentStatus)}
          color={getPaymentStatusColor(order.paymentStatus)}
          size="small"
        />
      </TableCell>
      <TableCell align="left">
        <Chip
          label={getStatusLabel(order.status)}
          color={getStatusColor(order.status)}
          size="small"
        />
      </TableCell>
      <TableCell>{order.expectedDeliveryTime}</TableCell>
      <TableCell>{new Date(order.createdAt).toLocaleString("vi-VN")}</TableCell>
      <TableCell>{new Date(order.updatedAt).toLocaleString("vi-VN")}</TableCell>
      <TableCell>
        {order.pickupImage ? (
          <img
            src={`data:image/jpeg;base64,${order.pickupImage}`}
            alt="Pickup"
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
            disabled={userRole !== "WAREHOUSE_MANAGER" && userRole !== "DRIVER"}
          >
            <Button
              onClick={() =>
                setOpenDropdown(
                  openDropdown === order.trackingCode
                    ? null
                    : order.trackingCode
                )
              }
            >
              <Menu />
            </Button>
          </ButtonGroup>

          <Collapse in={openDropdown === order.trackingCode}>
            <Box mt={1} display="flex" flexDirection="column" gap={1}>
              {userRole === "WAREHOUSE_MANAGER" &&
                order.warehouseManagerRole === "sourceWarehouseManager" &&
                [
                  "CREATED",
                  "ASSIGNED_TO_SHIPPER",
                  "PICKED_UP_SUCCESSFULLY",
                  "RECEIVED_AT_SOURCE",
                ].includes(order.status) && (
                  <>
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      disabled={
                        [
                          "ASSIGNED_TO_SHIPPER",
                          "PICKED_UP_SUCCESSFULLY",
                        ].includes(order.status) ||
                        !order.isPickupDriverNull ||
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
                      onClick={() => handleConfirmWarehouse(order.trackingCode)}
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
                        handleConfirmLeaveWarehouse(order.trackingCode)
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
                    disabled={
                      order.isDeliveryDriverNull === false ||
                      order.pickupImage != null
                    }
                    onClick={() => handleConfirmPickup(order.trackingCode)}
                  >
                    Lấy hàng
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    disabled={
                      order.isDeliveryDriverNull !== false ||
                      order.deliveryImage != null
                    }
                    onClick={() => handleConfirmDelivery(order.trackingCode)}
                  >
                    Giao hàng
                  </Button>
                </>
              )}

              {userRole === "WAREHOUSE_MANAGER" &&
                order.warehouseManagerRole === "sourceWarehouseManager" &&
                ["LEFT_SOURCE", "AT_DESTINATION", "OUT_FOR_DELIVERY"].includes(
                  order.status
                ) && (
                  <>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      disabled={["AT_DESTINATION", "OUT_FOR_DELIVERY"].includes(
                        order.status
                      )}
                      onClick={() =>
                        handleConfirmDeliveryWarehouse(order.trackingCode)
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
                        handlePickUpShipperDeliveryClick(order.trackingCode)
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
  );
};

export default OrderRow;
