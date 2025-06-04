import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Calculator } from "lucide-react";
import React, { useState } from "react";
import { lookUpShippingInfo } from "../../services/warehouse";
import { LookUpShippingInfoRequest } from "../../types/warehouse.types";
import LocationSelector from "../shared/LocationSelector";
import { hideLoading, showLoading } from "../shared/loadingHandler";

interface ShippingFeeResult {
  fee: number;
  dateRange: string;
}

const ShippingFeeCalculator: React.FC = () => {
  const [fromLocation, setFromLocation] = useState({
    province: "",
    district: "",
    ward: "",
    address: "",
  });
  const [toLocation, setToLocation] = useState({
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<ShippingFeeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = async () => {
    if (!fromLocation.province || !toLocation.province) {
      setError("Vui lòng chọn đủ tỉnh gửi và nhận.");
      setResult(null);
      return;
    }

    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError("Vui lòng nhập trọng lượng hợp lệ (> 0).");
      setResult(null);
      return;
    }

    setLoading(true);
    showLoading("Đang tính cước vận chuyển...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setError("");
    setResult(null);

    try {
      const requestData: LookUpShippingInfoRequest = {
        fromProvince: fromLocation.province,
        toProvince: toLocation.province,
      };

      const response = await lookUpShippingInfo(requestData);

      let baseFee = 0;
      let extraFee = 0;

      if (parsedWeight < 5) {
        baseFee = 15000;
      } else if (parsedWeight < 10) {
        baseFee = 20000;
      } else if (parsedWeight < 15) {
        baseFee = 25000;
      } else if (parsedWeight < 20) {
        baseFee = 30000;
      } else {
        baseFee = 35000;
      }

      if (parsedWeight > 5) {
        const extraKg = parsedWeight - 5;
        extraFee = Math.ceil(extraKg) * 2000;
      }

      const totalFee = response.data.shippingFee + baseFee + extraFee;

      setResult({
        fee: totalFee,
        dateRange: response.data.estimatedDeliveryTime,
      });
    } catch (err) {
      setError("Lỗi khi tính cước vận chuyển. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography fontWeight={"bold"} mb={1}>
            Gửi từ:
          </Typography>
          <LocationSelector
            value={fromLocation}
            onChange={setFromLocation}
            showDetails={false}
            gridItemStyle={{ width: "100%", maxWidth: "400px" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography fontWeight={"bold"} mb={1}>
            Gửi đến:
          </Typography>
          <LocationSelector
            value={toLocation}
            onChange={setToLocation}
            showDetails={false}
            gridItemStyle={{ width: "100%", maxWidth: "400px" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <Typography fontWeight={"bold"} mb={2}>
            Trọng lượng
          </Typography>
          <TextField
            label="Trọng lượng (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            type="number"
            inputProps={{ min: "0", step: "0.1" }}
            sx={{ minWidth: "400px", bgcolor: "#f9fafb" }}
          />
        </Grid>
        <Grid size={{ xs: 12 }} display="flex" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalculate}
            disabled={loading || !fromLocation.province || !toLocation.province || !weight}
            startIcon={<Calculator />}
            fullWidth
            sx={{ height: "50px", whiteSpace: "nowrap" }}
          >
            Tính cước
          </Button>
        </Grid>
      </Grid>

      {loading && (
        <Box mt={2} display="flex" justifyContent="center">
          <CircularProgress size={28} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result && !loading && !error && (
        <Box
          mt={4}
          sx={{
            borderRadius: 1,
            bgcolor: "#1976d22e",
            p: 10,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            mb={1}
            textTransform={"uppercase"}
            marginBottom={2}
          >
            tổng tiền cước vận chuyển
          </Typography>
          <Typography variant="h3" color="red" my={2}>
            {result.fee.toLocaleString()} VND
          </Typography>
          <Typography>Thời gian dự kiến giao: {result.dateRange}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ShippingFeeCalculator;
