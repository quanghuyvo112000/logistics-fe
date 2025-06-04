import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartData } from "../../types/income.type";
import CustomTooltip from "./CustomTooltip";
import { Box, Paper, Typography } from "@mui/material";

interface RevenueChartDisplayProps {
  data: ChartData[];
}

const RevenueChartDisplay: React.FC<RevenueChartDisplayProps> = ({ data }) => (
  <Box component={Paper} elevation={3} p={2} my={4} borderRadius={2}>
    <Typography variant="h6" mb={2} color="text.primary">
      Biểu đồ Doanh thu
    </Typography>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value / 1000}K`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="amount" fill="#3b82f6" name="Doanh thu (₫)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

export default RevenueChartDisplay;
