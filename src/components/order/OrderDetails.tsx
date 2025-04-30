import type React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Delete, Upload } from "@mui/icons-material";
import { FormErrors, FormData } from "../../types/order.type";

interface OrderDetailsProps {
  formData: FormData;
  errors: FormErrors;
  imagePreview: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  formData,
  errors,
  imagePreview,
  handleInputChange,
  setFormData,
  setImagePreview,
  setErrors,
}) => {
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weight = parseFloat(e.target.value);
    let shippingFee = 0;

    if (weight < 5) {
      shippingFee = 15000;
    } else if (weight >= 5 && weight < 10) {
      shippingFee = 20000;
    } else if (weight >= 10 && weight < 15) {
      shippingFee = 25000;
    } else if (weight >= 15 && weight < 20) {
      shippingFee = 30000;
    } else if (weight >= 20) {
      shippingFee = 35000;
    }

    // Update the formData with the new weight and shippingFee
    setFormData((prev) => ({
      ...prev,
      weight: weight.toString(),
      shippingFee: shippingFee.toString(),
    }));

    // Clear any errors related to weight
    if (errors.weight) {
      setErrors((prev) => ({
        ...prev,
        weight: undefined,
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Kiểm tra xem file có phải là ảnh không
      if (!file.type.match("image.*")) {
        setErrors((prev) => ({
          ...prev,
          pickupImage: "Vui lòng tải lên file ảnh hợp lệ",
        }));
        return;
      }

      // Kiểm tra kích thước file (giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          pickupImage: "Kích thước ảnh không được vượt quá 5MB",
        }));
        return;
      }

      // Lưu file vào state
      setFormData((prev) => ({
        ...prev,
        pickupImage: file,
      }));

      // Tạo URL xem trước
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error for this field
      if (errors.pickupImage) {
        setErrors((prev) => ({
          ...prev,
          pickupImage: undefined,
        }));
      }
    }
  };

  // Xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      pickupImage: null,
    }));
    setImagePreview(null);
  };

  // Định dạng hiển thị kích thước file
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${Math.round(size / 1024)} KB`;
    } else {
      return `${Math.round((size / (1024 * 1024)) * 10) / 10} MB`;
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Thông tin đơn hàng
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            fullWidth
            label="Trọng lượng (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleWeightChange}
            error={!!errors.weight}
            helperText={errors.weight}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            fullWidth
            label="Giá trị đơn hàng"
            name="orderPrice"
            type="number"
            value={formData.orderPrice}
            onChange={handleInputChange}
            error={!!errors.orderPrice}
            helperText={errors.orderPrice}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₫</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            fullWidth
            label="Phí vận chuyển"
            name="shippingFee"
            type="number"
            disabled
            value={formData.shippingFee}
            onChange={handleInputChange}
            error={!!errors.shippingFee}
            helperText={errors.shippingFee}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₫</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ảnh đơn hàng
            </Typography>
            {!imagePreview ? (
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
                  onChange={handleFileChange}
                />
              </Button>
            ) : (
              <Box sx={{ mt: 2, maxWidth: 300, position: "relative" }}>
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Ảnh đơn hàng"
                  style={{ width: "100%", borderRadius: 4 }}
                />
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {formData.pickupImage?.name} (
                    {formData.pickupImage
                      ? formatFileSize(formData.pickupImage.size)
                      : ""}
                    )
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleRemoveImage}
                    aria-label="Xóa ảnh"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}
            {errors.pickupImage && (
              <FormHelperText error>{errors.pickupImage}</FormHelperText>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default OrderDetails;
