import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Package, Search } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { fetchHistoryOrder } from "../../services/history";
import { OrderHistoryItem } from "../../types/history";
import OrderHistoryTimeline from "./OrderHistoryTimeline";

const HistoryPage: React.FC = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [histories, setHistories] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!trackingCode.trim()) {
      setError("Vui lòng nhập mã đơn hàng");
      setHistories([]);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetchHistoryOrder({ trackingCode });
      setHistories(res.data.histories);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError(
        "Không thể tìm thấy thông tin đơn hàng. Vui lòng kiểm tra lại mã đơn hàng."
      );
      setHistories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="home" py={6}>
      <Box>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            maxWidth: "900px",
            mx: "auto",
          }}
        >
          <Box textAlign="center" mb={5}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight="bold"
              color="primary"
            >
              Tra cứu đơn hàng
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", mt: 2 }}
            >
              Nhập mã đơn hàng để theo dõi trạng thái vận chuyển
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            sx={{ mb: 5, maxWidth: 800, mx: "auto" }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 9 }}>
                <TextField
                  label="Mã đơn hàng"
                  variant="outlined"
                  value={trackingCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTrackingCode(value);
                    if (!value.trim()) {
                      setError("");
                      setHistories([]);
                    }
                  }}
                  fullWidth
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Package size={22} />
                      </InputAdornment>
                    ),
                    sx: { fontSize: "1.1rem", py: 0.5 },
                  }}
                  placeholder="Nhập mã đơn hàng của bạn"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={<Search />}
                  sx={{ height: "56px", fontSize: "1.1rem" }}
                >
                  Tra cứu
                </Button>
              </Grid>
            </Grid>
          </Box>

          {loading ? (
            <Box textAlign="center" py={5}>
              <Typography variant="h6">Đang tìm kiếm...</Typography>
            </Box>
          ) : histories.length > 0 ? (
            <Box mt={5}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ mb: 4, fontWeight: 600, textAlign: "center" }}
              >
                Lịch sử đơn hàng: {trackingCode}
              </Typography>
              <OrderHistoryTimeline histories={histories} />
            </Box>
          ) : null}
        </Paper>
      </Box>
    </Box>
  );
};

export default HistoryPage;
