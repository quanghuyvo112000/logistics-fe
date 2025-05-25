import type React from "react";
import { useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import {
  FormErrors,
  FormData,
  LocationValue,
  Warehouse,
} from "../../types/order.type";
import { searchWarehouseLocations } from "../../services/order";
import LocationSelector from "../shared/LocationSelector";

interface SenderInformationProps {
  formData: FormData;
  senderLocation: LocationValue;
  sourceWarehouses: Warehouse[];
  errors: FormErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSenderLocation: React.Dispatch<React.SetStateAction<LocationValue>>;
  setSourceWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const SenderInformation: React.FC<SenderInformationProps> = ({
  formData,
  senderLocation,
  sourceWarehouses,
  errors,
  handleInputChange,
  setSenderLocation,
  setSourceWarehouses,
  setFormData,
}) => {
  // Fetch warehouses when sender location changes
  useEffect(() => {
    const fetchSourceWarehouses = async () => {
      if (senderLocation.province && senderLocation.district) {
        try {
          const response = await searchWarehouseLocations({
            province: senderLocation.province,
            district: senderLocation.district,
          });

          if (response.status === 200 && response.data) {
            setSourceWarehouses(response.data);
            // Automatically select the first warehouse if available
            if (response.data.length > 0) {
              setFormData((prev) => ({
                ...prev,
                sourceWarehouseId: response.data[0].id,
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching source warehouses:", error);
        }
      } else {
        setSourceWarehouses([]);
        setFormData((prev) => ({
          ...prev,
          sourceWarehouseId: "",
        }));
      }
    };
    fetchSourceWarehouses();
  }, [
    senderLocation.province,
    senderLocation.district,
    setFormData,
    setSourceWarehouses,
  ]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Thông tin người gửi
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Tên người gửi"
            name="senderName"
            value={formData.senderName}
            onChange={handleInputChange}
            error={!!errors.senderName}
            helperText={errors.senderName}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Số điện thoại người gửi"
            name="senderPhone"
            value={formData.senderPhone}
            onChange={handleInputChange}
            error={!!errors.senderPhone}
            helperText={errors.senderPhone}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" gutterBottom>
            Địa chỉ người gửi
          </Typography>
          <LocationSelector
            value={senderLocation}
            onChange={setSenderLocation}
          />
          {errors.senderAddress && (
            <FormHelperText error>{errors.senderAddress}</FormHelperText>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" gutterBottom>
            Kho gửi hàng
          </Typography>
          {sourceWarehouses.length > 0 ? (
            <Box
              sx={{
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                bgcolor: "#f9fafb",
              }}
            >
              <Typography variant="body1">
                {sourceWarehouses.find(
                  (w) => w.id === formData.sourceWarehouseId
                )?.warehouseName || "Không có kho phù hợp"}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                bgcolor: "#f9fafb",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {senderLocation.province && senderLocation.district
                  ? "Không tìm thấy kho gửi hàng tại khu vực này"
                  : "Vui lòng chọn tỉnh/thành phố và quận/huyện để hiển thị kho gửi hàng"}
              </Typography>
            </Box>
          )}
          {errors.sourceWarehouseId && (
            <FormHelperText error>{errors.sourceWarehouseId}</FormHelperText>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default SenderInformation;
