import { Upload } from "@mui/icons-material"; // Icon upload
import { Box, Button, FormHelperText, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { confirmOrderPickupDelivery } from "../../services/order";
import { OrderConfirmDeliveryRequest } from "../../types/order.type";
import CommonModal from "../shared/CommonModal";

interface ConfirmPickupModalProps {
  trackingCode: string;
  orderPrice: number;
  shippingFee: number;
  onClose: () => void;
  fetchOrders: () => void;
}

const ConfirmDeliveryModal: React.FC<ConfirmPickupModalProps> = ({
  trackingCode,
  orderPrice,
  shippingFee,
  onClose,
  fetchOrders,
}) => {
  const [pickupImage, setPickupImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const { showMessage } = useSnackbar();

  const totalAmount: number = orderPrice + shippingFee;

  const handleConfirm = async () => {
    if (!pickupImage) {
      setImageError("Vui lòng tải lên ảnh khi lấy hàng");
      return false; // không đóng modal nếu chưa có ảnh
    }

    setLoading(true);
    const request: OrderConfirmDeliveryRequest = {
      trackingCode,
      pickupImage,
    };

    try {
      await confirmOrderPickupDelivery(request);
      fetchOrders();
      showMessage("Giao hàng thành công!", "success");
      onClose(); // Đóng modal sau khi thành công
      return true;
    } catch (error) {
      console.error("Error confirming pickup:", error);
      return false; // không đóng modal nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      open
      onClose={onClose}
      title="Xác nhận giao hàng"
      onConfirm={handleConfirm}
      confirmText={loading ? "Đang xử lý..." : "Xác nhận"}
      confirmColor="success"
      cancelText="Hủy"
    >
      <Typography
        variant="h6"
        sx={{
          my: 1,
          fontWeight: "bold",
          backgroundColor: "#ffe6e6",
          p: 5,
          mb: 5,
          textAlign: "center",
        }}
      >
        Tổng tiền cần thu:{" "}
        <Box component="span" sx={{ color: "red" }}>
          {totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Box>
      </Typography>
      <Box sx={{ p: 5,  backgroundColor: "#f9fafb",}}>
        <Typography sx={{fontWeight: "bold"}}>Vui lòng tải ảnh khi giao hàng cho mã đơn:</Typography>
        <Typography variant="h6" sx={{ my: 1}}>
          {trackingCode}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {!pickupImage ? (
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              sx={{ mb: 1 }}
            >
              Tải lên ảnh
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setPickupImage(file);
                  setImageError(null); // Reset error when a file is selected
                }}
              />
            </Button>
          ) : (
            <Box sx={{ mt: 2, maxWidth: 300, position: "relative" }}>
              <img
                src={URL.createObjectURL(pickupImage)}
                alt="Ảnh đơn hàng"
                style={{ width: "100%", borderRadius: 4 }}
              />
              <Box
                sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}
              >
                <Typography variant="caption" color="text.secondary">
                  {pickupImage?.name}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => setPickupImage(null)}
                  aria-label="Xóa ảnh"
                >
                  Xóa ảnh
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {imageError && <FormHelperText error>{imageError}</FormHelperText>}
    </CommonModal>
  );
};

export default ConfirmDeliveryModal;
