import React from "react";
import { ChartData } from "../../types/income.type";
import { formatCurrency } from "../../utils/moneyFormat";
import { Box, Typography, Grid, Paper } from "@mui/material";

interface SummaryStatsProps {
  data: ChartData[];
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ data }) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.amount, 0);
  const averageRevenue = Math.round(totalRevenue / data.length);
  const maxRevenue = Math.max(...data.map((item) => item.amount));

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: "#f9fafb" }}>
      <Typography variant="h6" gutterBottom color="text.primary">
        Tổng quan
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Tổng doanh thu
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {formatCurrency(totalRevenue)}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Doanh thu trung bình
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "success.main" }}>
              {formatCurrency(averageRevenue)}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Doanh thu cao nhất
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "secondary.main" }}>
              {formatCurrency(maxRevenue)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SummaryStats;
