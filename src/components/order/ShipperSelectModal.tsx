import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { fetchWorkStatusSchedules } from "../../services/calendar";
import { assignShipperPickUp } from "../../services/order";
import { WorkScheduleStatus } from "../../types/calendar.types";
import CommonModal from "../shared/CommonModal";
import { hideLoading, showLoading } from "../shared/loadingHandler";

interface ShipperSelectModalProps {
  trackingCode: string;
  onClose: () => void;
  fetchOrders: () => Promise<void>;
}

const ShipperSelectModal = ({
  trackingCode,
  onClose,
  fetchOrders,
}: ShipperSelectModalProps) => {
  const [shippers, setShippers] = useState<WorkScheduleStatus[]>([]);
  const [selectedShipper, setSelectedShipper] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showMessage } = useSnackbar();

  useEffect(() => {
    const fetchShippers = async () => {
      setLoading(true);
      showLoading("Đang tải danh sách shipper...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const response = await fetchWorkStatusSchedules();
        setShippers(response);
        setError(null);
      } catch (err) {
        setError("Không thể tải danh sách shipper.");
        console.error(err);
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchShippers();
  }, [trackingCode]);

  const handleSelectShipper = (event: SelectChangeEvent<string>) => {
    setSelectedShipper(event.target.value);
  };

  const handleAssignShipper = async (): Promise<boolean> => {
    if (!selectedShipper) return false;

    setLoading(true);
    try {
      await assignShipperPickUp({
        trackingCode,
        driverId: selectedShipper,
      });
      onClose();
      showMessage("Chọn shipper đến lấy hàng thành công!", "success");
      fetchOrders();
      return true;
    } catch (err) {
      setError("Không thể gán shipper. Vui lòng thử lại.");
      console.error("Assign shipper failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonModal
      open={true}
      onClose={onClose}
      title="Chọn Shipper"
      loading={loading}
      confirmText={loading ? "Đang xử lý..." : "Xác nhận"}
      onConfirm={handleAssignShipper}
      confirmColor="primary"
      actions={
        <>
          <Button onClick={onClose} color="secondary">
            Đóng
          </Button>
          <Button
            onClick={handleAssignShipper}
            color="primary"
            disabled={!selectedShipper || loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </>
      }
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <FormControl sx={{ mt: 2 }} fullWidth>
            <InputLabel id="shipper-select-label">Chọn Shipper</InputLabel>
            <Select
              labelId="shipper-select-label"
              value={selectedShipper || ""}
              onChange={handleSelectShipper}
              label="Chọn Shipper"
            >
              {shippers.map((shipper) => (
                <MenuItem key={shipper.driverId} value={shipper.driverId}>
                  {shipper.nameDriver && shipper.vehicleType
                    ? `${shipper.nameDriver} - ${shipper.vehicleType}`
                    : "Không có tên shipper"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {" "}
            {selectedShipper
              ? shippers.find((shipper) => shipper.driverId === selectedShipper)
                  ?.nameDriver
              : "chưa chọn"}{" "}
            sẽ lấy đơn hàng có mã tracking {trackingCode}.
          </Typography>
        </>
      )}
    </CommonModal>
  );
};

export default ShipperSelectModal;
