import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import type React from "react";
// import { Delete, Upload } from "@mui/icons-material";
import { FormData, FormErrors } from "../../types/order.type";
import { formatCurrency, unformatCurrency } from "../../utils/moneyFormat";

interface OrderDetailsProps {
  formData: FormData;
  errors: FormErrors;
  // imagePreview: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  // setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  formData,
  errors,
  handleInputChange,
  setFormData,
  setErrors,
}) => {
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weight = parseFloat(e.target.value);

    // Update the formData with the new weight and shippingFee
    setFormData((prev) => ({
      ...prev,
      weight: weight.toString(),
    }));

    // Clear any errors related to weight
    if (errors.weight) {
      setErrors((prev) => ({
        ...prev,
        weight: undefined,
      }));
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
            value={formatCurrency(formData.orderPrice)}
            onChange={(e) => {
              const rawValue = unformatCurrency(e.target.value);
              setFormData((prev) => ({
                ...prev,
                orderPrice: rawValue,
              }));
            }}
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
            value={formatCurrency(formData.shippingFee)}
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
      </Grid>
    </>
  );
};

export default OrderDetails;
