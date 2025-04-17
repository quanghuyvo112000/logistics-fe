import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import {
  LineChart,
  PieChart,
  pieArcLabelClasses,
} from "@mui/x-charts";
import { useEffect } from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";
import LoadingHandler from "../components/shared/loadingHandler";


const tripData = [
  { x: "Mon", y: 120 },
  { x: "Tue", y: 150 },
  { x: "Wed", y: 170 },
  { x: "Thu", y: 90 },
  { x: "Fri", y: 200 },
  { x: "Sat", y: 80 },
  { x: "Sun", y: 130 },
];

const orderStatus = [
  { label: "Đang xử lý", value: 45 },
  { label: "Đã giao", value: 30 },
  { label: "Đã huỷ", value: 10 },
  { label: "Hoàn trả", value: 15 },
];

const stats = [
  {
    label: "Tổng chuyến hàng",
    value: 840,
    icon: <LocalShippingIcon fontSize="large" color="primary" />,
  },
  {
    label: "Tài xế hoạt động",
    value: 112,
    icon: <DirectionsBusFilledIcon fontSize="large" color="success" />,
  },
  {
    label: "Số kho",
    value: 64,
    icon: <StoreIcon fontSize="large" color="warning" />,
  },
  {
    label: "Đơn hàng đang xử lý",
    value: 127,
    icon: <AssignmentIcon fontSize="large" color="error" />,
  },
];

const Dashboard = () => {
  return (
    <LoadingHandler>
      {(showLoading, hideLoading) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          showLoading();

          // Giả lập thời gian load
          const timer = setTimeout(() => {
            hideLoading();
          }, 1500);

          return () => clearTimeout(timer);
        }, []);

        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Logistics Dashboard
            </Typography>

            {/* Thống kê nhanh với icon */}
            <Grid container spacing={2} mb={3}>
              {stats.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
                    {item.icon}
                    <Box>
                      <Typography variant="subtitle2">{item.label}</Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {item.value}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Biểu đồ */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: 300 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Số chuyến hàng trong tuần
                    </Typography>
                    <LineChart
                      xAxis={[{ scaleType: "point", data: tripData.map((d) => d.x) }]}
                      series={[
                        {
                          data: tripData.map((d) => d.y),
                          label: "Trips",
                          color: "#1976d2",
                        },
                      ]}
                      height={220}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: 300 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Trạng thái đơn hàng
                    </Typography>
                    <PieChart
                      series={[
                        {
                          data: orderStatus,
                          arcLabel: (item) => `${item.label} (${item.value})`,
                          arcLabelMinAngle: 10,
                        },
                      ]}
                      height={220}
                      slotProps={{
                        legend: { hidden: true },
                      }}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fontSize: 12,
                          fill: "white",
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      }}
    </LoadingHandler>
  );
};

export default Dashboard;
