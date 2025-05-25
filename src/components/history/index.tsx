/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Package, Search } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { fetchHistoryOrder } from "../../services/history";
import { OrderHistoryItem } from "../../types/history";
import { TabPanel } from "../shared/TabPanel";
import OrderHistoryTimeline from "./OrderHistoryTimeline";
import ShippingFeeCalculator from "./ShippingFeeCalculator";
import WarehouseLookup from "./WarehouseLookup";

const HistoryPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0); // <-- state quản lý tab
  const [trackingCode, setTrackingCode] = useState("");
  const [histories, setHistories] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

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
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 2,
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Tra cứu đơn hàng" />
          <Tab label="Cước Vận Chuyển" />
          <Tab label="Tra bưu cục" />
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          {/* Tra cứu đơn hàng */}
          <Box textAlign="center" mb={5} mt={3}>
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
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          {/* Cước Vận Chuyển */}
          <Typography
            variant="h3"
            component="h1"
            textAlign="center"
            gutterBottom
            fontWeight="bold"
            color="primary"
            mb={5}
            mt={3}
          >
            Cước Vận Chuyển
          </Typography>
          <ShippingFeeCalculator />
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          {/* Tra bưu cục */}
          <Typography
            variant="h3"
            component="h1"
            textAlign="center"
            gutterBottom
            fontWeight="bold"
            color="primary"
            mb={5}
            mt={3}
          >
            Tra cứu bưu cục
          </Typography>
          <WarehouseLookup />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default HistoryPage;
