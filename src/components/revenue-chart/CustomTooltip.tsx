/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { formatCurrency } from "../../utils/moneyFormat";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ p: 2, border: "1px solid #e0e0e0" }}>
        <Box>
          <Typography variant="body2" fontWeight={500} color="text.primary">
            {label}
          </Typography>
          <Typography variant="body2" fontWeight={600} color="primary">
            Doanh thu: {formatCurrency(payload[0].value)}
          </Typography>
        </Box>
      </Paper>
    );
  }
  return null;
};

export default CustomTooltip;
