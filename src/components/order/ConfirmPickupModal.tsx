import { Upload } from "@mui/icons-material";
import { Box, Button, FormHelperText, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { createIncomeByTrackingCode } from "../../services/income";
import { confirmOrderPickup } from "../../services/order";
import { OrderConfirmPickupRequest } from "../../types/order.type";
import CommonModal from "../shared/CommonModal";
import { hideLoading, showLoading } from "../shared/loadingHandler";

interface ConfirmPickupModalProps {
  trackingCode: string;
  onClose: () => void;
  fetchOrders: () => void;
}

const ConfirmPickupModal: React.FC<ConfirmPickupModalProps> = ({
  trackingCode,
  onClose,
  fetchOrders,
}) => {
  const [pickupImage, setPickupImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const { showMessage } = useSnackbar();

  const handleConfirm = async () => {
    if (!pickupImage) {
      setImageError("Vui lòng tải lên ảnh khi lấy hàng");
      return false;
    }

    setLoading(true);
    showLoading("Đang xác nhận lấy hàng...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const request: OrderConfirmPickupRequest = {
      trackingCode,
      pickupImage,
    };

    try {
      await confirmOrderPickup(request);

      fetchOrders();
      
      // update lương shipper
      await createIncomeByTrackingCode(trackingCode);

      showMessage("Lấy hàng thành công!", "success");
      onClose();
      return true;
    } catch (error) {
      console.error("Error confirming pickup:", error);
      return false;
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <CommonModal
      open
      onClose={onClose}
      title="Xác nhận đã lấy hàng"
      onConfirm={handleConfirm}
      confirmText={loading ? "Đang xử lý..." : "Xác nhận"}
      confirmColor="success"
      cancelText="Hủy"
    >
      <Box sx={{ p: 5, backgroundColor: "#f9fafb" }}>
        <Typography sx={{ fontWeight: "bold" }}>
          Vui lòng tải ảnh khi lấy hàng cho mã đơn:
        </Typography>
        <Typography variant="h6" sx={{ my: 1 }}>
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
                  setImageError(null);
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

export default ConfirmPickupModal;
