/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { Search, Warehouse } from "lucide-react";
import React, { useState } from "react";
import { lookUpWarehouse } from "../../services/warehouse";
import LocationSelector from "../shared/LocationSelector";
import { hideLoading, showLoading } from "../shared/loadingHandler";

interface LookUpWarehouse {
  warehouseName: string;
  province: string;
  district: string;
  address: string;
  phone: string;
}

const WarehouseLookup: React.FC = () => {
  const [location, setLocation] = useState({
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<LookUpWarehouse[]>([]);

  const handleSearch = async () => {
    if (!location.province) return;
    setLoading(true);
    showLoading("Đang tải danh sách bưu cục...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await lookUpWarehouse({ province: location.province });
      setWarehouses(response.data || []);
    } catch (error) {
      console.error("Failed to fetch warehouse list");
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" mt={2}>
        <Grid size={{ xs: 12, sm: "auto" }}>
          <LocationSelector
            value={location}
            onChange={setLocation}
            showDetails={false}
            gridItemStyle={{ minWidth: "600px" }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: "auto" }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !location.province}
            startIcon={<Search />}
            sx={{ height: "55px", whiteSpace: "nowrap", marginTop: "15px" }}
          >
            {loading ? <CircularProgress size={24} /> : "Tra cứu bưu cục"}
          </Button>
        </Grid>
      </Grid>

      <Box mt={4}>
        {warehouses.length > 0 ? (
          <Grid container spacing={3}>
            {warehouses.map((wh, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <Card
                  variant="outlined"
                  sx={{ height: "100%", bgcolor: "#f9fafb" }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      color="primary"
                      textTransform={"uppercase"}
                      gutterBottom
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Warehouse size={50} />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {wh.warehouseName}
                        </Typography>
                      </Box>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      my={"10px"}
                      fontSize={"16px"}
                    >
                      <strong>Địa chỉ:</strong> {wh.address}, {wh.district},{" "}
                      {wh.province}.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Điện thoại: </strong> {wh.phone}.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography mt={2} color="text.secondary" textAlign="center">
            {loading
              ? "Đang tải dữ liệu..."
              : "Vui lòng chọn tỉnh/thành phố để tra cứu bưu cục"}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default WarehouseLookup;
